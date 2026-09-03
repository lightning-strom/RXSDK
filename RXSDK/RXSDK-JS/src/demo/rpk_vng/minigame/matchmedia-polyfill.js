(function () {
    function mm(media) {
      return {
        matches: false,
        media: media || '',
        onchange: null,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () { return false; },
      };
    }

    if (typeof globalThis !== 'undefined' && typeof globalThis.matchMedia !== 'function') {
      globalThis.matchMedia = mm;
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
      window.matchMedia = mm;
    }
  })();