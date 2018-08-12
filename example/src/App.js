import React from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';
import ShapeView from './ShapeView'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {shape: 'logo',
                  status: ''};
  }

  // check connection
  checkConnection = () => {
    fetch('https://demo-server.approovr.io/hello', {
      method: 'GET',
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      return response.text()
    })
    .then((text) => {
      this.setState(previousState => {
        return { shape: 'hello', status: text };
      })
    })
    .catch((error) => {
      this.setState(previousState => {
        return { shape: 'confused', status: error.message };
      })
    });
  }

  // render the app screen
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{fontSize: 24}}>Approov Shapes</Text>
        </View>
        <ShapeView style={styles.content} shape={this.state.shape} status={this.state.status}/>
        <View style={styles.footer}>
          <View style={styles.buttonBar}>
          <Button onPress={this.checkConnection} title="Test Hello" />
          </View>
        </View>
      </View>
    );
  }
}

// flexbox styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    margin: 10,
  },
  header: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    flex: .8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
});

// end of file
