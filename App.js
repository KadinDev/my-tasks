import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native';

console.disableYellowBox=true;

import firebase from './src/firebaseConnection';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';

import { TaskList } from './src/TaskList';

const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity);
const InputAnimated = Animatable.createAnimatableComponent(TextInput);

export default function App() {
  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('Nova Task');
  const [tasks, setTasks] = useState([]);

  //coloquei como key, a ideia é se a key estiver vazia é para adicionar
  //se estiver vazia está editando uma task
  const [key, setKey] = useState('');


  //
  const inputRef = useRef(null);
  function inputAnimation(){
    inputRef.current.rubberBand();
  }
  
  //
  async function handleAddNewTask(){

    if( input !== '' ){

      //se a key for diferente de vazio, ou seja quando clica em edit o tituto da task vai
      //para o input, então a key não estará vazia, sendo diferente de vazio vai entender que
      // é para editar uma task
      if(key !== ''){
        await firebase.database().ref('tarefas').child(key).update({
          nome: input,
        });
        Keyboard.dismiss();
        setInput('');
        setPlaceholder('Nova Task');
        setKey('');
        return;
      }

      let tarefas = await firebase.database().ref('tarefas');
      let chave = await tarefas.push().key; //gerar uma key

      tarefas.child(chave).set({
        nome: input
      });

      setInput('');
      setPlaceholder('Nova Task');
      Keyboard.dismiss();
      setKey('');

    } else {

      inputAnimation();
      setPlaceholder('Input não pode ficar vazaio!');
      Keyboard.dismiss();
      return;
      
    }
  };

  async function handleDeleteTask(key){
    await firebase.database().ref('tarefas').child(key).remove();
  };

  function handleEditTask(data){ //recebo todo o data da linha 42 da TaskList
    setInput(data.nome);//coloco o nome da task clicada dentro do input
    setKey(data.key);
  };

  function cancelEdit(){
    setKey('');
    setInput('');
    Keyboard.dismiss();
  }


  useEffect( () => {
    async function loadTasks(){
      await firebase.database().ref('tarefas').on('value', (snapshot) => {
        setTasks([]);

        snapshot.forEach( (tasks)=>{
          let data = {
            key: tasks.key,
            nome: tasks.val().nome
          };

          setTasks(oldArray => [...oldArray, data])
        } )
      } );
    }

    loadTasks();
  },[] )

  return (

    <View style={styles.container}>
      <StatusBar backgroundColor='#121212' barStyle='light-content' />

      { key.length > 0 && (
        <View style={{flexDirection: 'row', marginLeft: 20 }}>
          <TouchableOpacity
            onPress={cancelEdit}
          >
            <Icon name='x-circle' size={22} color='#fff' />
          </TouchableOpacity>
          <Text
            style={{marginLeft: 5, marginBottom: 5, color: '#fff', fontSize: 18}}
          > você está editando uma tarefa! </Text>
        </View>
      )}
      
      
      <View style={styles.containerTask}>
        <InputAnimated
          style={styles.input}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor="#999"
          onChangeText={ (value) => {setInput(value)} }
          value={input}

          animation='lightSpeedIn'
          duration={1000}

          ref={inputRef}
        />

        <ButtonAnimated 
          style={styles.buttonAdd}
          activeOpacity={0.7}

          animation='flash'
          duration={1000}
          iterationCount={2}

          onPress={handleAddNewTask}
        >
          <Text style={styles.buttonText}> + </Text>
        </ButtonAnimated>
      </View>


      <FlatList
        showsHorizontalScrollIndicator={false}
        data={tasks}
        keyExtractor={item => item.key}
      
        renderItem={ ({ item }) => (
          <TaskList 
            data={item} 
            deleteItem={handleDeleteTask}
            editItem={handleEditTask}
          />
        ) }
      />

      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212'
  },
  containerTask: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    padding: 10,
  },
  input: {
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#999',
    height: 40,
    fontSize: 18,
    borderRadius: 5,
    color: '#fff'
  },
  buttonAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: '#ff4f4f',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 50
  },
  buttonText: {
    fontSize: 25,
    color: '#FFF'
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    height: 120,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 80,
    borderTopLeftRadius: 80,
    paddingTop: 10

  },
  titleDel: {
    color: '#121212',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleTask: {
    color: '#121212',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 4,
    paddingBottom: 5
  },
  button: {
    marginTop: 10,
    backgroundColor: '#121212',
    padding: 7,
    borderRadius: 50,
  }
})