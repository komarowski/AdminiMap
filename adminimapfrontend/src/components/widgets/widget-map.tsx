import React from 'react';
import { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps'
import { useLocalStorage, useFetch } from '../../customHooks';
import { useSearchParams } from "react-router-dom";
import { Tabs, URLParams } from '../../routerParams';
import { IMarkerDTO } from '../../typesDTO';


interface IMarkerOverlay {
  anchor: [number, number];
  number: string;
  title: string;
  userName: string;
  display: string;
}

interface IMapArgs {
  event: any;
  anchor: any;
  payload: any;
}

interface IProps {
  zIndex: string;
}

const WidgetMap: React.FunctionComponent<IProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapState, setMapState] = useLocalStorage("mapstate", 
  { 
    'zoom': 15, 
    'long': 76.9184966987745, 
    'lat': 43.24979821566148
  });
  const markers = useFetch<Array<IMarkerDTO>>(`api/markers?zoom=${mapState.zoom}&lon=${mapState.long}&lat=${mapState.lat}`, [], true);
  const [markerOpen, setMarkerOpen] = useState<IMarkerOverlay | undefined>(undefined);

  const handleMarkerClick = (marker: IMarkerDTO, args: IMapArgs) => {
    if (marker) {
      setMarkerOpen(
        {
          'anchor': args.anchor, 
          'number': marker.number, 
          'title': marker.title, 
          'userName': marker.userName, 
          'display': 'display' 
        });
    }
  };

  const handleMarkerOpenedClick = (number: string) => {
    if (number) {
      searchParams.set(URLParams.TabNumber, Tabs.Note);
      searchParams.set(URLParams.NoteNumber, number); 
      setSearchParams(searchParams);
    }
  };

  const handleBoundsChanged = (centerN: [number, number], zoomN: number) => {
    const delta = 0.0005 * Math.pow(2, 19 - zoomN);
    if (zoomN !== mapState.zoom 
      || Math.abs(centerN[0] - mapState.lat) > delta 
      || Math.abs(centerN[1] - mapState.long) > delta)
    {
      setMapState(
        { 
          'zoom': zoomN, 
          'long': centerN[1], 
          'lat': centerN[0]
        });
    }
  };

  return (
    <div className="w4-section w4-section--map" style={{zIndex: props.zIndex}}>
      <Map
        defaultCenter={[mapState.lat, mapState.long]} 
        defaultZoom={mapState.zoom} 
        onBoundsChanged={({ center, zoom }) => { 
          handleBoundsChanged(center, zoom)
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.number}
            width={50}
            anchor={[marker.latitude, marker.longitude]} 
            color={"#2b6777"} 
            onClick={(args) => handleMarkerClick(marker, args)}
          />
        ))}
        {
          markerOpen &&
            <Overlay anchor={markerOpen.anchor} offset={[0, 0]}>
              <div className="w4-marker-popup" style={{display: markerOpen.display}}>
                <div className="w4-link"  onClick={() => handleMarkerOpenedClick(markerOpen.number)}>{markerOpen.title}</div>
                <div>u/{markerOpen.userName}</div>
              </div>
            </Overlay>
        }       
      </Map>
    </div>
  );
}

export default WidgetMap;