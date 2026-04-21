export function useLibrary(url: string, libName?: string, _onLoad?: VoidFunction){
  if (process.server) return

  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.referrerPolicy = "no-referrer";
  
  script.onload = () => {
    if (libName && !(window as any)[libName]) {
      document.location.reload();
    } else {
      if (_onLoad){
        _onLoad();
      }
    }
  }

  document.body.appendChild(script);
}
