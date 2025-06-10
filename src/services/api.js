// em src/services/api.js
import axios from 'axios';

// ATENÇÃO AQUI:
// Se você estiver usando o emulador do Android, o endereço para acessar seu 'localhost'
// do computador é '10.0.2.2'.
// Se estiver testando em um celular físico, você precisa colocar o IP da sua máquina na rede.
// Ex: 'http://192.168.0.10:8080'

const api = axios.create({
  baseURL: 'http:/192.168.162.182:8080' 
});

export default api;