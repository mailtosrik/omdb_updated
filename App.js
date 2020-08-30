import * as React from 'react';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

var jwtToken;

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function createFilm(filmInput, ratingInput) {
  // alert(filmName);
  // alert(filmRating);
  try {
    // var filmInput = this.state.filmName;
    if (filmInput == "undefined" || filmInput.trim() == "" || filmInput == null) {
      alert("Please enter a valid film name.");
      // document.getElementById("inputFilm").focus();
      return false;
    }

    // var ratingInput = this.state.rating;
    if (ratingInput == "undefined" || ratingInput == null || ratingInput == "" || ratingInput < 0 || ratingInput > 5) {
      alert("Please provide a rating for the film between 1 and 5.");
      // document.getElementById("inputRating").focus();
      return false;
    }

    fetch("http://10.165.1.173:8080/api/v1/films", {
      method: 'POST',
      body: JSON.stringify({ name: filmInput, rating: ratingInput }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + jwtToken
      }
    }).then(resp => {
      setTimeout(function () {
        if (resp.status == 200) {
          alert("Cool!Added your Film into the Database.");
          // document.getElementById("inputFilm").value = "";
          // document.getElementById("inputRating").value = "";
        } else {
          alert("Error" + resp.status + ": " + resp.statusText);
          // document.getElementById("inputFilm").value = "";
          // document.getElementById("inputRating").value = "";
        }
      }, 0)
    });
  } catch (e) {
    console.log(e);
    console.log('---------------------');
  }
  // return false;
}

function HomeScreen({ navigation }) {
  const [filmName, setFilmName] = React.useState('');
  const [filmRating, setFilmRating] = React.useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text>{"\n"}</Text>
      <Text>{"\n"}</Text>
      <TextInput placeholder="Enter Film Name"
        id="filmName"
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setFilmName(text)}
      // value={text}
      />
      <Text>{"\n"}</Text>
      <TextInput placeholder="Enter Film Rating (between 1 and 5)"
        id="filmRating"
        style={styles.inputText}
        keyboardType={'numeric'}
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setFilmRating(text)}
      // value={this.text}
      />
      <Text>{"\n"}</Text>
      <Button style={styles.loginBtn} onPress={() => { createFilm(filmName, filmRating); }} title="Submit" />
    </View>
  );
}

function login(userName) {
  if (userName == "undefined" || userName.trim() == "" || userName == null) {
    alert("Please provide your user name.");
  }
  else {
    try {
      fetch("http://10.165.1.173:8080/api/v1/login", {
        method: 'POST',
        body: JSON.stringify({
          username: userName
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then(resp => resp.json()).then(data => {
          jwtToken = data.token;
          // alert(this.state.jwtToken);
          alert("Successfully logged in!");
        });
    } catch (e) {
      console.log(e);
      console.log('-----------------------------');
    }
  }
}

function LoginScreen({ navigation }) {
  const [userName, setUserName] = React.useState('');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput placeholder="Enter User Name"
        id="userName"
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setUserName(text)}
      // value={text}
      />
      <Text>{"\n"}</Text>
      <Button style={styles.loginBtn} onPress={() => { login(userName); }} title="Login" />

    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
    </View>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      {/* <HomeStack.Screen name="Details" component={DetailsScreen} /> */}
    </HomeStack.Navigator>
  );
}

function LoginStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Login" component={LoginScreen} />
      {/* <HomeStack.Screen name="Details" component={DetailsScreen} /> */}
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      {/* <SettingsStack.Screen name="Details" component={DetailsScreen} /> */}
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginStackScreen} />
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    // backgroundColor: "#465881",
    borderRadius: 75,
    height: 50,
    marginBottom: 50,
    justifyContent: "center",
    borderColor: 'gray',
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgot: {
    // color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white",
    // alignItems:"flex-start"
  },
  header: {
    height: 60,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 5,
  },
  menu: {
    width: 20,
    height: 2,
    backgroundColor: '#111',
    margin: 2,
    borderRadius: 3,
  },
  text: {
    marginVertical: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  textInput: {
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderColor: 'gray',
    borderBottomWidth: 2,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableHighlight: {
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  }
});
