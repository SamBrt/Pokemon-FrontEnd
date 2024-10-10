import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'; 
import Homepage from './components/Homepage'; 
import Registrazione from './components/Registrazione'; 
import Login from './components/Login'; 
import Dashboard from './components/Dashboard'; 

// Funzione per controllare se l'utente è loggato (verifica se esiste 'userSession' in sessionStorage)
function checkIfUserLogged() {
  const userSession = sessionStorage.getItem('userSession');
  
  // Se l'utente è già loggato, reindirizzalo alla dashboard
  if (userSession) {
    return redirect('/dashboard');
  }

  // Se non è loggato, consenti l'accesso alla pagina
  return null;
}

// Funzione per controllare se l'utente NON è loggato (per pagine protette come la dashboard)
function checkIfUserNotLogged() {
  const userSession = sessionStorage.getItem('userSession');
  
  // Se l'utente NON è loggato, reindirizzalo alla pagina di login
  if (!userSession) {
    return redirect('/login');
  }

  // Se l'utente è loggato, consenti l'accesso alla pagina
  return null;
}

// Definisci il router usando createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/register',
    element: <Registrazione />, // Rimuovi il loader qui
  },
  {
    path: '/login',
    element: <Login />,
    loader: checkIfUserLogged, // Verifica se l'utente è loggato
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: checkIfUserNotLogged, // Verifica se l'utente NON è loggato
  },
]);


// Usa RouterProvider per avvolgere l'applicazione e passare il router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

