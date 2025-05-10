import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Welcome from '../pages/Welcome'
import SignIn from '../pages/SignIn'
import Register from '../pages/Register'
import IndexPage from '../pages/IndexPage';
import Agendamento from '../pages/Agendamento';
import AgendamentoChurrasqueira from '../pages/AgendamentoChurrasqueira';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer() {
  return (
    <Drawer.Navigator screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#1E90FF',
          width: 240,
        },
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#FFF',
      }}>
      <Drawer.Screen 
        name="IndexPage" 
        component={IndexPage} 
        options={{ title: 'Página Inicial', headerShown: false }}
      />
      <Drawer.Screen 
        name="Agendamento" 
        component={Agendamento} 
        options={{ title: 'Reservar Salão', headerShown: false }}
      />
      <Drawer.Screen 
        name="AgendamentoChurrasqueira"
        component={AgendamentoChurrasqueira} 
        options={{ title: 'Reservar Churrasqueira', headerShown: false }}
      />

      <Drawer.Screen 
        name="Welcome" 
        component={Welcome} 
        options={{ title: 'Sair', headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
            />

            <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
            />

            <Stack.Screen
              name="HomeDrawer"
              component={HomeDrawer}
              options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}