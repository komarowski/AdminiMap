import React from 'react';
import { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps'
import { useFetch, useLocalStorage } from '../../customHooks';
import { useSearchParams } from "react-router-dom";
import { Tabs, URLParams } from '../../constants';
import { INoteDTO } from '../../types';
import { CloseIcon } from '../icons/icons';


interface IMapState {
  zoom: number;
  long: number;
  lat: number;
}

const defaultMapState: IMapState = {
  'zoom': 15, 
  'long': 76.9184966987745, 
  'lat': 43.24979821566148
}

const useMarkersRequest = (mapState: IMapState, query: string | null, tagSum: string | null): Array<INoteDTO> => {
  let request = `api/markers?zoom=${mapState.zoom}&lon=${mapState.long}&lat=${mapState.lat}`;
  if (query){
    request += '&query=' + query;
  }
  if (tagSum) {
    request += '&tags=' + tagSum;
  }
  return useFetch<Array<INoteDTO>>(request, [], true);
};

const useSelectedNote = <T,>(propsValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(propsValue);

  React.useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  return [value, setValue];
};

const usePopupDisplay = (propsValue: INoteDTO | null): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState(propsValue ? 'block' : 'none');

  React.useEffect(() => {
    setValue(propsValue ? 'block' : 'none');
  }, [propsValue]);

  return [value, setValue];
};

interface IProps {
  note: INoteDTO | null;
  zIndex: string;
}

const WidgetMap: React.FunctionComponent<IProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapStateCache, setMapStateCache] = useLocalStorage<IMapState>(
    'mapstate',
    { 
      'zoom': defaultMapState.zoom, 
      'long': defaultMapState.long,
      'lat': defaultMapState.lat
    });
  const [mapState, setMapState] = useState<IMapState>(mapStateCache);

  const markers = useMarkersRequest(mapState, searchParams.get(URLParams.SearchQuery), searchParams.get(URLParams.TagSum));
  const [selectedNote, setSelectedNote] = useSelectedNote<INoteDTO | null>(props.note);
  const [popupDisplay, setPopupDisplay] = usePopupDisplay(props.note);
  const center: [number, number] = [props.note ? props.note.latitude : defaultMapState.lat, props.note ? props.note.longitude : defaultMapState.long];

  const handleMarkerClick = (marker: INoteDTO) => {
    setSelectedNote(marker);
    setPopupDisplay('block');
  };

  const handlePopupClick = (number: string) => {
    searchParams.set(URLParams.TabNumber, Tabs.Note);
    searchParams.set(URLParams.NoteNumber, number); 
    setSearchParams(searchParams);
    setMapStateCache({ 
      'zoom': mapState.zoom, 
      'long': center[1], 
      'lat': center[0]
    });
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
        defaultCenter={[mapStateCache.lat, mapStateCache.long]} 
        defaultZoom={mapStateCache.zoom}
        center={center}
        onBoundsChanged={({ center, zoom }) => { 
          handleBoundsChanged(center, zoom)
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.number}
            width={50}
            anchor={[marker.latitude, marker.longitude]} 
            color={searchParams.get(URLParams.NoteNumber) === marker.number ? "#52ab98" : "#2b6777"}  
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
        {
          selectedNote &&
            <Overlay 
              anchor={[selectedNote.latitude, selectedNote.longitude]} 
              offset={[86, -8]}
            >
              <div className="w4-marker-popup" style={{display: popupDisplay}}>
                <div className="w4-link"  onClick={() => handlePopupClick(selectedNote.number)}>
                  {selectedNote.title}
                </div>
                <div>
                  u/{selectedNote.userName}
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <div className="w4-button w4-button-marker" onClick={() => setPopupDisplay('none')}>
                    {CloseIcon}
                  </div>
                </div>               
              </div>
            </Overlay>
        }       
      </Map>
    </div>
  );
}

export default WidgetMap;