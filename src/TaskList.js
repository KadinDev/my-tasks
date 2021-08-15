import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

export function TaskList( {data, deleteItem, editItem } ){

    const [modal, setModal] = useState(false);

    function openModal(){
        setModal(true);
    };

    function closeModal(){
        setModal(false);
    };


    return (
        <View 
            style={styles.container}
        >   
            <View style={{paddingRight: 15}}>
                <Text 
                    style={styles.nameTask}
                    nameTask={data.nome}
                > {data.nome} </Text>
            </View>

            <View style={styles.Buttons}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.edit}

                    //passo todo o data, para pegar a key e todos os outros detalhes do data
                    onPress={ () => editItem(data) }
                >
                    <Icon name="edit" color="#FFF" size={20} />
                </TouchableOpacity>

                <Text style={styles.separar}>|</Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={ openModal }
                >
                    <Icon name="trash" color="#FFF" size={20} />
                </TouchableOpacity>
            </View>


            <Modal
                visible={modal}
                animationType='slide'
                transparent={true}
            >
                <View style={styles.modal}>
                    
                    <Text style={styles.titleDelete}>Deseja excluir ?</Text>
                    <Text style={styles.titleTask}> {data.nome} </Text>

                    <View style={styles.iconsModal}>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.icon}

                            onPress={ () => deleteItem(data.key) }//data.key, pego ela na linha 65 do App.js
                        >
                            <Icon name='check' color="#FFF" size={25} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.icon}

                            onPress={closeModal}
                        >
                            <Icon name='x' color="#FFF" size={25}/>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>
            
        </View>
    )
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 12,
        padding: 15,
        borderRadius: 10,
        position: 'relative',
        backgroundColor: '#353839',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#888',
        borderLeftColor: '#888',
    },
    nameTask: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'normal'
    },
    Buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4f4f',
        position: 'absolute',
        right: 5,
        bottom: -8,
        paddingRight: 5,
        paddingLeft: 5,
        borderRadius: 5
    },
    separar: {
        color: '#fff',
        marginLeft: 4,
        marginRight: 4,
        fontSize: 20,
        paddingBottom: 5,
    },
    modal: {
        backgroundColor: '#fff',
        bottom: 0,
        width: '100%',
        position: 'absolute',
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        paddingTop: 5,
        paddingBottom: 5,
    },
    titleDelete: {
        color: '#121212',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 2
    },
    titleTask: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
        backgroundColor: '#121212',
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 15,
        marginBottom: 10
    },
    iconsModal: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    icon: {
        backgroundColor: '#121212',
        padding: 5,
        borderRadius: 50
    }
    
})