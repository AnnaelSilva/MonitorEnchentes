import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

// Configuração das credenciais do Firebase (via variáveis de ambiente Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_EXEMPLO_API_KEY_ACADEMICA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clima-monitor-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "clima-monitor-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "clima-monitor-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo123"
};

// Inicialização do Firebase App e Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const ALERTS_COLLECTION = 'alertas';

/**
 * Escuta em tempo real todas as alterações na coleção de alertas do Firestore.
 * Executa o callback sempre que um novo alerta é criado ou modificado.
 *
 * @param {Function} onUpdate Callback acionado com a lista atualizada de alertas
 * @param {Function} onError Callback acionado em caso de erro na conexão
 * @returns {Function} Função de cancelamento do listener (unsubscribe)
 */
export function subscribeToAlerts(onUpdate, onError) {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alertsList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            tipo: data.tipo || 'enchente',
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            descricao: data.descricao || '',
            severidade: data.severidade || 'media',
            timestamp: data.timestamp ? data.timestamp.toDate?.() || new Date(data.timestamp) : new Date()
          };
        });
        onUpdate(alertsList);
      },
      (error) => {
        console.error('Erro ao sincronizar Firestore:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Falha ao inicializar listener do Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Cria um novo alerta colaborativo no Firestore.
 *
 * @param {Object} alertData Objeto contendo tipo, latitude, longitude, descricao e severidade
 * @returns {Promise<string>} ID do documento inserido
 */
export async function createAlert(alertData) {
  const docRef = await addDoc(collection(db, ALERTS_COLLECTION), {
    tipo: alertData.tipo,
    latitude: Number(alertData.latitude),
    longitude: Number(alertData.longitude),
    descricao: alertData.descricao,
    severidade: alertData.severidade || 'media',
    timestamp: serverTimestamp()
  });
  return docRef.id;
}
