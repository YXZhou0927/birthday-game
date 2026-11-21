/** GPS helpers for confirm gates. */

const EARTH_M = 6371000;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in meters. */
export function distanceMeters(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function isNear(target, position, radiusMeters) {
  if (!position) return false;
  return distanceMeters(target, position) <= radiusMeters;
}

/**
 * One-shot geolocation read.
 * @returns {Promise<{lat:number,lng:number,accuracy:number}|null>}
 */
export function readPosition(options = {}) {
  if (!navigator.geolocation) return Promise.resolve(null);

  const opts = {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 5000,
    ...options,
  };

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      () => resolve(null),
      opts
    );
  });
}

/**
 * Watch position until near target or aborted.
 * @returns {{ promise: Promise<boolean>, stop: () => void }}
 */
export function watchUntilNear(target, radiusMeters, { onUpdate } = {}) {
  let watchId = null;
  let stopped = false;

  const stop = () => {
    stopped = true;
    if (watchId != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  const promise = new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (stopped) return;
        const here = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        const dist = distanceMeters(target, here);
        onUpdate?.({ here, dist, near: dist <= radiusMeters });
        if (dist <= radiusMeters) {
          stop();
          resolve(true);
        }
      },
      () => {
        onUpdate?.({ here: null, dist: null, near: false, error: true });
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
  });

  return { promise, stop };
}
