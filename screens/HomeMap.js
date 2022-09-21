import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polygon } from 'react-native-maps';
import Constants from 'expo-constants';
import geolib from 'geolib';
import { isPointInPolygon } from 'geolib';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

export default function HomeMap(){

  const [contains, setContains] = useState(null)

  const [location, setLocation]= useState({
    //latitude: 55.722460,
    //longitude: 12.569134, // default location if non is granted from phone
   // latitude:55.700671, 
    //longitude:12.492936,
    latitude: 55.700873, 
    longitude: 12.492986
  })

  const [polygon, setPolygon]= useState([ //Ryvangen, should instead be a DB full of polygons?
    { latitude: 55.722860, longitude: 12.568134 },
    { latitude: 55.723062, longitude: 12.565878 },
    { latitude: 55.724972, longitude: 12.566067 },
    { latitude: 55.725192, longitude: 12.568284 }
  ])  

  const [BRONSHØJ,setBRONSHØJ] =useState([
    {latitude: 55.700883, longitude: 12.492926},
    {latitude: 55.700883, longitude: 12.493411},
    {latitude: 55.700846, longitude: 12.493532},
    {latitude: 55.700671, longitude: 12.492936}

  ])

  useEffect(() => {
    getLocation();
    isContained();
    console.log("GotLoc");
  }, []); // if changes, run the getLocation agian

  useEffect(()=>{
    if(contains==true){
      console.log(contains + " should be true");
    }else{
      console.log(contains + " should be false");
      //if not inside polygon
    }
  }, [contains]) // run hook when contains Changes

  const locations = [polygon, BRONSHØJ]

  const isContained = () =>{ // there might be a layer or two too many here.
    for (let i = 0; i < locations.length; i++) {  
      setContains(
        isPointInPolygon({ 
          latitude: location.latitude,longitude: location.longitude,},locations[i])
        )
      console.log(locations[i] + " contains device: " + contains);   
    }
  }

  const getLocation = async () => { // unsure if its watches ooor....
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    const { latitude, longitude } = location.coords
    setLocation({ latitude, longitude });
  }; 

  return (
    
      <View style={styles.screenContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>

          <MapView.Polygon
            coordinates={polygon}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={2}
          />
              <MapView.Polygon
            coordinates={BRONSHØJ}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={2}
          />
          <Marker
          coordinate={location}
          />
        </MapView>
      </View>
  
    );
}

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-between',
    ...StyleSheet.absoluteFill,
    paddingTop: Constants.statusBarHeight,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});