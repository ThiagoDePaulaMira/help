import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useNavigation,useRoute } from '@react-navigation/native';
import { OrderProps } from '../components/Order';
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';

import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard} from 'phosphor-react-native';
import { Button } from '../components/Button';

type RouteParams = {
    orderId: string;
}

type  OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {

  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();

    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params as RouteParams;

    function handleOrderClose(){
      if(!solution){
        return Alert.alert('Solicitacao', 'Informar a solucao para encerrar a solicitacao');
      }

      firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitacao', 'Solicitacao encerrada.')
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitacao', 'Nao foi possivel encerrar a solicitacao');
      })
    }

    useEffect(() => {
      firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution} = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        });

        

        setIsLoading(false);
      })
    }, []);

    if(isLoading){
      return<Loading/>
    }

  return (
    <VStack flex={1} bg='gray.700'>
      <Box px={6} bg='gray.600'>
        <Header title='solicitacao'/>
      </Box>  
        <HStack bg='gray.500' justifyContent='center' p={4}>
          {
            order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]}/>
            : <Hourglass size={22} color={colors.secondary[700]}/>
          }

          <Text 
            fontSize='sm'
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform='uppercase'
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          </Text>
        </HStack>

        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails
            title='equipamento'
            description={`Patrimonio ${order.patrimony}`}
            icon={DesktopTower}
            footer={order.when}
          />

          <CardDetails
            title='descricao do problema'
            description={order.description}
            icon={Clipboard}
          />

          <CardDetails
            title='solucao'
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' &&
              <Input placeholder='descricao da solucao'
                onChangeText={setSolution}
                h={24}
                textAlignVertical='top'
                multiline
              />
            }
          </CardDetails>
        </ScrollView>

        {
          order.status === 'open' && 
          <Button
            title='Encerrar solicitacao'
            m={5}
            onPress={handleOrderClose}
          />
        }
    </VStack>
  );
}