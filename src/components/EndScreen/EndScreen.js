import * as Clipboard from "expo-clipboard";

import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import Animated, {SlideInLeft} from 'react-native-reanimated';
import React, {useEffect, useState} from "react";
import { colors, colorsToEmoji } from "../../constants";

import AsyncStorage from"@react-native-async-storage/async-storage";

const Number = ({number, label}) => (
    <View style={{alignItems:"center", margin: 10}}>
        <Text style={{color: colors.lightgrey, fontSize: 30, fontWeight: "bold"}}>{number}</Text>
        <Text style={{color: colors.lightgrey, fontSize: 16,}}>{label}</Text>
    </View>
)

const GuessDistributionLine = ({position, amount, percentage}) =>{
    return (
        <View style={{
            flexDirection: "row",
             alignItems: "center",
              alignSelf:"stretch",
               width: `${percentage}%`,
               minWidth: 20,}}>
            <Text style={{color: colors.lightgrey,}}>{position}</Text>
            <View style={{
                            alignSelf: "stretch",
                            backgroundColor: colors.grey, 
                            width: "100%",
                            margin: 5, 
                            padding: 5}}>
                                <View style={{backgroundColor:"blue", width:"50%"}} />
                <Text style={{color: colors.lightgrey,}}>{amount}</Text>
            </View>
        </View>
    )
};

const GuessDistribution = ({distribution}) =>{
    if (!distribution) {
        return null;
    }

    const sum = distribution.reduce((total, dist) => dist + total, 0 );
    
    return (
        <>
<Text style={styles.subtitle}>GUESS DISTRIBRUTION</Text>
<View style={{width:"100%", padding: 20}}>
                {distribution.map((dist, index) => (
                <GuessDistributionLine 
                key={index}
                position={index + 1} 
                amount={dist}
                 percentage={100 * dist / sum} />
                ))}

                
                </View>
        </>
        
    )
};

const EndScreen = ({won = false, rows, getCellBGColor }) => {
    const [played, setPlayed] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [curStreak, setCurStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [distribution, setDistribution] = useState(null);

    //console.log(played)

    useEffect (() => {
        readState()
        }, [])

    const share = () => {
        const textMap = rows
          .map((row, i) =>
            row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
          )
          .filter((row) => row)
          .join("\n");
        const textToShare = `Wordstreak \n${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert("Copied successfully", "Share your score on you social media");
      };

      const readState = async () => {
        const dataString = await AsyncStorage.getItem("@game");
        let data;
        // console.log(dataString);
     try {
       data = JSON.parse(dataString);
      
       //console.log(data);
     } catch (e) {
       //console.log("couldn't parse the state");
     }
     const keys = Object.keys(data);
     const values = Object.values(data);
     
     setPlayed(keys.length);

      const numberOfWins = values.filter(game => game.gameState == 'won').length; // Stats - number of wins
      setWinRate(Math.floor((100 * numberOfWins) / keys.length));

     let _curStreak = 0; // Stats - Current streak
     let maxStreak = 0;
     let prevDay = 0; 
     keys.forEach((key) => {
         const day = parseInt(key.split("-")[1]);
         if (data[key].gameState == "won" && _curStreak == 0) {
            _curStreak += 1;
        } else if (data[key].gameState == "won" && prevDay + 1 == day) {
            _curStreak += 1;
        } else {
            
            _curStreak = data[key].gameState === "won" ? 1 : 0;
            }
            if (_curStreak > maxStreak) {
                //console.log(_curStreak)
                maxStreak = _curStreak;
                
            };
        prevDay = day;
    });
    //console.log(maxStreak, "Max")    
//console.log(_curStreak, "current");
    setCurStreak(_curStreak);
    setMaxStreak(maxStreak);

    // guess distribution 

const dist = [0,0,0,0,0,0];

values.map((game) => {
    if (game.gameState == "won") {
        const tries = game.rows.filter((row) => row[0]).length;
        dist[tries] = dist[tries] +1
        // console.log(dist);
    }
})
 //console.log(dist);
setDistribution(dist);
};



    return(
        <View style={{width:"100%", alignItems: "center"}}>
            <Animated.Text entering={SlideInLeft.springify().mass(0.5)} style={styles.title}>
                {won ? "Congrats!" : " Meh, Try again tomorrow"}</Animated.Text>

                <Animated.View entering={SlideInLeft.delay(100).springify().mass(0.5)}>
                <Text style={styles.subtitle}>STATISTICS</Text>
                <View style={{flexDirection:"row", alignItems: "center", marginBottom: 20}}>
                    <Number number={played} label={"Played"}/>
                    <Number number={winRate} label={"Win %"}/>
                    <Number number={curStreak} label={"Cur Streak"}/>
                    <Number number={maxStreak} label={"Max Streak"}/>
                </View>
                </Animated.View>
                <Animated.View entering={SlideInLeft.delay(200).springify().mass(0.5)} style={{width:"100%"}}>
                <GuessDistribution distribution={distribution}/>
                </Animated.View>
                
                <View style={{flexDirection:"row", padding: 10}}>
                    <View style={{alignItems: "center", flex:1}}>
                        <Text style={{color: colors.lightgrey}}>Next Wordstreak</Text>
                        <Text style={{color: colors.lightgrey, fontSize:24, fontWeight:"bold"}}>10:35:00</Text>
                    </View>
                    <Pressable onPress={share} style={{flex:1, backgroundColor: colors.primary, borderRadius: 25, alignItems:"center", justifyContent: "center"}}>
                        <Text style={{color: colors.lightgrey, fontWeight: "bold"}}>Play again</Text>
                    </Pressable>
                </View>
                
        </View>
    );
};


const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginVertical: 20,
    },
    subtitle:{
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: "center",
        fontWeight: "bold",
        marginVertical: 20,
    }
})

export default EndScreen;