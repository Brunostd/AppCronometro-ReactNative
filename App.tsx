import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CronometroState {
  contador: number;
  buttonName: String;
  lastCount: number;
}

interface CronometroManager {
  iniciarContador(callback: (contador: number) => void): void;
  limparContador(callback: () => void): void;
  getButtonName(callback: (buttonName: String) => void): void;
  getLastCount(callback: (lastCount: number) => void): void;
}

class CronometroManagerImpl implements CronometroManager {
  private timer: NodeJS.Timeout | null = null;
  private contador: number = 0.0;
  private buttonName: String = 'Iniciar';
  private lastCount: number = 0.0;

  iniciarContador(callback: (contador: number) => void) {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
      this.buttonName = 'Iniciar';
    } else {
      this.timer = setInterval(() => {
        this.contador += 0.1;
        callback(this.contador);
      }, 100);
      this.buttonName = 'Parar';
    }
  }

  limparContador(callback: () => void) {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.lastCount = this.contador;
    this.contador = 0.0;
    callback();
  }

  getButtonName(callback: (buttonName: String) => void): void {
    callback(this.buttonName);
  }

  getLastCount(callback: (lastCount: number) => void): void {
    callback(this.lastCount);
  }
}

class App extends Component<{}, CronometroState> {
  private cronometroManager: CronometroManager;

  constructor(props: {}) {
    super(props);
    this.state = {
      contador: 0.0,
      buttonName: 'Iniciar',
      lastCount: 0.0,
    };
    this.cronometroManager = new CronometroManagerImpl();
  }

  iniciarContador() {
    this.cronometroManager.iniciarContador(contador => {
      this.setState({contador});
    });
    this.setButtonName();
  }

  limparContador() {
    this.cronometroManager.limparContador(() => {
      this.setState({
        contador: 0.0,
      });
    });
    this.setButtonName();
    this.setLastCount();
  }

  setButtonName() {
    this.cronometroManager.getButtonName(buttonName => {
      this.setState({buttonName});
    });
  }

  setLastCount() {
    this.cronometroManager.getLastCount(last => {
      this.setState({
        lastCount: last,
      });
    });
  }

  render(): React.ReactNode {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require('./src/cronometro.png')}
          style={styles.imgCronometro}
        />
        <Text style={styles.timer}>{this.state.contador.toFixed(1)}</Text>
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.iniciarContador()}>
            <Text style={styles.btnContent}>{this.state.buttonName}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.limparContador()}>
            <Text style={styles.btnContent}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerLastCount}>
          <Text style={styles.contentLastCount}>
            Ultimo tempo: {this.state.lastCount.toFixed(1)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00aeef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCronometro: {},
  timer: {
    marginTop: -160,
    color: 'white',
    fontSize: 65,
    fontWeight: 'bold',
  },
  btnArea: {
    flexDirection: 'row',
    marginTop: 80,
    height: 40,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 17,
    backgroundColor: '#fff',
    height: 40,
    borderRadius: 16,
  },
  btnContent: {
    color: 'black',
  },
  containerLastCount: {
    marginTop: 40,
  },
  contentLastCount: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
