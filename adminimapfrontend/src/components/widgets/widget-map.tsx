import React from 'react';
import { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps'
import { useFetch, useLocalStorage } from '../../customHooks';
import { useSearchParams } from "react-router-dom";
import { DEFAULTMAPSTATE, LocalStorageParams, Tabs, URLParams } from '../../constants';
import { IMapState, INoteDTO } from '../../types';
import { CloseIcon } from '../icons/icons';


const useMarkersRequest = (mapState: IMapState, query: string | null, tagSum: string | null): Array<INoteDTO> => {
  let request = `api/mapnotes?zoom=${mapState.zoom}&lon=${mapState.long}&lat=${mapState.lat}`;
  if (query){
    request += `&query=${query}`;
  }
  if (tagSum) {
    request += `&tags=${tagSum}`;
  }
  return useFetch<Array<INoteDTO>>(request, []);
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
  setNoteTab: (tab: string) => void;
}

const WidgetMap: React.FunctionComponent<IProps> = (props) => {
  const {note} = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [mapStateCache, setMapStateCache] = useLocalStorage<IMapState>(
    LocalStorageParams.MAPSTATE,
    { 
      zoom: DEFAULTMAPSTATE.zoom, 
      long: DEFAULTMAPSTATE.long,
      lat: DEFAULTMAPSTATE.lat
    });
  const [mapState, setMapState] = useState<IMapState>(mapStateCache);
  const markers = useMarkersRequest(mapState, searchParams.get(URLParams.SEARCHQUERY), searchParams.get(URLParams.TAGSUM));
  const [selectedNote, setSelectedNote] = useSelectedNote<INoteDTO | null>(note);
  const [popupDisplay, setPopupDisplay] = usePopupDisplay(note);
  const center: [number, number] = [note ? note.latitude : DEFAULTMAPSTATE.lat, note ? note.longitude : DEFAULTMAPSTATE.long];
  const noteNumber = searchParams.get(URLParams.NOTENUMBER);

  const handleMarkerClick = (marker: INoteDTO) => {
    setSelectedNote(marker);
    setPopupDisplay('block');
  };

  const handlePopupClick = (number: string) => {
    props.setNoteTab(Tabs.NOTE);
    searchParams.set(URLParams.NOTENUMBER, number); 
    setSearchParams(searchParams);
    setMapStateCache({ 
      zoom: mapState.zoom, 
      long: center[1], 
      lat: center[0]
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
          zoom: zoomN, 
          long: centerN[1], 
          lat: centerN[0]
        });
    }
  };

  return (
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
          color={noteNumber === marker.number ? "#52ab98" : "#2b6777"}  
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
  );
}

export default WidgetMap;