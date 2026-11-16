/* v4.3 accessibility preferences: applied in <head> before first paint (no flash). Own code, no third-party widget. */
(function(){try{var p=JSON.parse(localStorage.getItem('hw-a11y')||'{}'),c=document.documentElement.classList;
if(p.fs>0&&p.fs<=4){c.add('a11y-fs');document.documentElement.style.setProperty('--a11y-fs',String(1+p.fs*.125))}
if(p.hc)c.add('a11y-hc');if(p.links)c.add('a11y-links');if(p.still)c.add('a11y-still');if(p.font)c.add('a11y-font');}catch(e){}})();
