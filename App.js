import * as React from 'react';
import { RefreshControl, ScrollView, Button, Text, View, TextInput, StyleSheet, FlatList, Modal, TouchableHighlight, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';

var jwtToken;

function HomeScreen() {
  const [filmName, setFilmName] = React.useState('');
  const [filmRating, setFilmRating] = React.useState('');
  const image = { uri: "https://raw.githubusercontent.com/mailtosrik/gudenberg/master/portrait_2.jpg" };

  function createFilm(filmInput, ratingInput) {

    try {
      if (filmInput == "undefined" || filmInput.trim() == "" || filmInput == null) {
        alert("Please enter a valid film name.");
        return false;
      }

      else if (ratingInput == "undefined" || ratingInput == null || ratingInput == "" || ratingInput < 0 || ratingInput > 5) {
        alert("Please provide a rating for the film between 1 and 5.");
        return false;
      }

      else {
        fetch("http://10.165.0.204:8080/api/v1/films", {
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

            } else {
              alert("Error" + resp.status + ": " + resp.statusText);
            }

          }, 0)
        }
        );
      }
    } catch (e) {
      console.log(e);
      console.log('---------------------');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={image} style={styles.image}>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>
          <Text style={styles.text, { fontSize: 20 }} >Enter the Film Name and your rating!</Text>

          <Text>{"\n"}</Text>

          <TextInput placeholder="Enter Film Name"
            id="filmName"
            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => setFilmName(text)}
            placeholderTextColor="black"
            value={filmName}
          />
          <Text>{"\n"}</Text>
          <TextInput placeholder="Enter Film Rating (between 1 and 5)"
            id="filmRating"
            placeholderTextColor="black"
            style={styles.inputText}
            keyboardType={'numeric'}
            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, color: 'black' }}
            onChangeText={text => setFilmRating(text)}
            value={filmRating}
          />
          <Text>{"\n"}</Text>
          <Button style={styles.loginBtn} onPress={() => {
            createFilm(filmName, filmRating);
            setFilmName("");
            setFilmRating("");
          }}

            title="Submit" />

        </View>
      </ImageBackground>
    </TouchableWithoutFeedback >
  );
}

function login(userName) {
  if (userName == "undefined" || userName.trim() == "" || userName == null) {
    alert("Please provide your user name.");
  }
  else {
    try {
      fetch("http://10.165.0.204:8080/api/v1/login", {
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

  const image = { uri: "https://raw.githubusercontent.com/mailtosrik/gudenberg/master/crop%20(1).jpg" };
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    jwtToken = null;
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      <ScrollView
        contentContainerStyle={styles.scrollView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground source={image} style={styles.image}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput placeholder="Enter User Name"
              id="userName"
              style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white' }}
              onChangeText={text => setUserName(text)}
              value={userName}
            />
            <Text>{"\n"}</Text>
            <Button style={styles.loginBtn} onPress={() => { login(userName); setUserName(""); }} title="Login" />
          </View>
        </ImageBackground>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}


function FilmListScreen({ navigation }) {

  const [data, setData] = React.useState([]);
  const [isModalVisible, setisModalVisible] = React.useState(false);
  const [inputText, setInputTextValue] = React.useState("");
  const [editedItem, setId] = React.useState("");
  const [updatedRating, setUpdatedRating] = React.useState();
  const [movieName, setMovieName] = React.useState("");
  const image = { uri: "https://raw.githubusercontent.com/mailtosrik/gudenberg/master/plain_portrait.jpg" };
  const [showList, setShowList] = React.useState(true);

  if (showList) {
    getFilms();
    setShowList(false);
  }

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFilms();
    wait(1000).then(() => setRefreshing(false));
  }, []);



  function setModalVisible(bool) {
    setisModalVisible(bool);
  }

  function setInputText(rating) {
    setInputTextValue(rating);
  }

  function setEditedItem(_id) {
    setId(_id);
  }

  function setMovieNames(filmNamed) {
    setMovieName(filmNamed)
  }

  function handleEditItem(editedItem, updatedRating) {
    const newData = data.map(item => {
      if (item._id === editedItem) {
        if (updatedRating == "undefined" || updatedRating == null || updatedRating == "" || updatedRating < 0 || updatedRating > 5) {
          alert("Please provide a rating for the film between 1 and 5.");
        }
        else {

          try {
            fetch("http://10.165.0.204:8080/api/v1/films", {
              method: 'PUT',
              body: JSON.stringify({ rating: updatedRating, id: editedItem }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + jwtToken
              }
            }).then(resp => {
              setTimeout(function () {
                if (resp.status == 200) {
                  alert("Updated your rating for the film: " + movieName);
                } else {
                  alert("Error" + resp.status + ": " + resp.statusText);
                }
              }, 0)
            });

          } catch (error) {
            console.log(error);
            console.log('------------------------');
          }
        }
      }
    })
  }

  const renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { setModalVisible(true); setInputText(item.rating), setEditedItem(item._id), setMovieNames(item.name) }}>
      <View style={styles.item} >
        <Text style={styles.textList}> {item.name + ", " + "Rating: " + item.rating} </Text>
      </View>
    </TouchableHighlight>
  );

  function getFilms() {

    try {
      fetch("http://10.165.0.204:8080/api/v1/films", {
        method: 'GET',
        json: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
        .then((results) => {
          if (typeof results != "undefined" &&
            results != null &&
            results.length != null &&
            results.length > 0) {
            setData(results);
          }
          else {
            alert("No movies are stored in the Database!");
          }
        })

    } catch (error) {
      console.log(error);
      console.log('-----------------------------');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        <ImageBackground source={image} style={styles.image} >

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item._id} refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />


          <Modal animationType="slide" visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalView}>
              <Text style={styles.text}>Change Rating:</Text>
              <TextInput
                style={styles.textInput}
                defaultValue={inputText.toString()}
                keyboardType={'numeric'}
                editable={true}
                multiline={false}
                maxLength={200}
                onChangeText={text => setUpdatedRating(text)}
              />
              <Button title="Save" onPress={() => { handleEditItem(editedItem, updatedRating); getFilms(); setModalVisible(false) }}
                style={styles.loginBtn}>
              </Button>
            </View>
          </Modal>
          <Text>{"\n"}</Text>
        </ImageBackground>

      </View>
    </TouchableWithoutFeedback>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function LoginStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Login" component={LoginScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function FilmListStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Film List" component={FilmListScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.text}>
      <Tab.Navigator style={styles.text}>
        <Tab.Screen name="Login" component={LoginStackScreen} style={styles.text} />
        <Tab.Screen name="Home" component={HomeStackScreen} style={styles.text} />
        <Tab.Screen name="Film List" component={FilmListStackScreen} style={styles.text} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  inputText: {
    height: 50,
    color: "white"
  },
  loginBtn: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
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
  text: {
    marginVertical: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  textList: {
    marginVertical: 30,
    fontSize: 15,
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
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    flex: 1,
  },
});
