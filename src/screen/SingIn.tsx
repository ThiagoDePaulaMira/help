import { useState } from 'react'
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { VStack, Heading, Icon, useTheme } from 'native-base';

import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../asset/logooo.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SignIn() {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [ password, setPassword] = useState('');

    const { colors } = useTheme();

    function handleSingIn() {
        if(!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha.');
        }

        setIsLoading(true);
        
        auth().signInWithEmailAndPassword(email, password).catch((error) => {
            console.log(error);
            setIsLoading(false);

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail invalido.');
            }

            if(error.code === 'auth/wrong-password'){
                return Alert.alert('Entrar', 'E-mail ou senha invalida.');
            }

            if(error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'E-mail ou senha invalida.');
            }

            return Alert.alert('Entrar', 'Nao foi possivel acessar');
        })
    }

    return(
        <VStack flex={1} alignItems='center' bg='#edce1f' px={8} pt={24} >
            <Logo  width={120} height={40}/>
            <Heading color='black' fontSize='xl' mt={20} mb={6}>
                Acesse sua conta 
            </Heading>

            <Input 
                placeholder='E-mail'
                mb={4}
                InputLeftElement={<Icon as={ <Envelope color={colors.gray[300]} /> } ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                mb={8}
                placeholder='Senha'
                InputLeftElement={<Icon as={ <Key color={colors.gray[300]} /> } ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button 
                title='Entrar'
                w='full'
                onPress={handleSingIn}
                isLoading={isLoading}
                />

        </VStack>
    )
}