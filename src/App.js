import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import de Bootstrap CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Importer axios
import './App.css';

function App() {
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Ajouter cet état pour l'OTP

  // Fonctions existantes...

  const fetchData = () => {
    setLoading(true); // Activer l'indicateur de chargement

    // Effectuer une requête GET pour récupérer les données du backend
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.Devis);
        setLoading(false); // Désactiver l'indicateur de chargement une fois les données récupérées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur
      });
  };

  useEffect(() => {
    // Appeler fetchData une fois lorsque le composant est monté
    fetchData();

    // Actualiser les données toutes les 5 secondes
    const interval = setInterval(fetchData, 5000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  const handleChangeOtp = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmitOtpForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/submit-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otpCode: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Une erreur est survenue lors de la soumission de l'OTP"
        );
      }

      console.log('OTP soumis avec succès');
      // Gérer le succès (rediriger l'utilisateur, afficher un message, etc.)
    } catch (error) {
      console.error('Erreur :', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (queryString) => {
    setLoading(true); // Activer l'indicateur de chargement

    // Effectuer une requête POST vers votre backend avec la chaîne de requête
    fetch('/api/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link: queryString }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Réponse du backend:', data);
        // Vérifier si le processus s'est terminé avec succès
        if (data.message === 'Données sauvegardées avec succès.') {
          // Afficher le message si nécessaire
          console.log(data.message);
          // Recharger la page
        } else {
          // Traiter d'autres cas si nécessaire
          console.error("Le processus n'a pas été terminé avec succès.");
          setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'envoi de la chaîne de requête au backend:",
          error
        );
        setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur
      });
  };
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get('/api/restaurants')
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des données des restaurants :',
          error
        );
      });
  }, []);

  useEffect(() => {
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.Devis);
        setLoading(false); // Désactiver l'indicateur de chargement une fois les données récupérées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false); // Désactiver l'indicateur de chargement en cas d'erreur
      });
  }, []);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log('Date de début sélectionnée :', date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    console.log('Date de fin sélectionnée :', date);
  };
  const generateQueryString = (startDate, endDate, ID) => {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return `https://merchants.ubereats.com/manager/payments?restaurantUUID=${ID}&start=${start}&end=${end}&rangeType=1`;
  };

  // Fonction pour afficher la chaîne de requête générée

  // Au moment où l'utilisateur sélectionne un ID (dans votre cas, via un clic sur un bouton)
  const handleIDSelection = (selectedID) => {
    // Utilisez le ID sélectionné pour générer la chaîne de requête

    const queryString = generateQueryString(startDate, endDate, selectedID);
    // Afficher la chaîne de requête générée
    console.log('Chaenovyer :', queryString);
    handleSubmit(queryString);
  };
  return (
    <div className="boody">
      <h1>realite de gain avec uber </h1>
      <h2 className="titredat">choisi la date que vous voulez pour le devis</h2>
      <div className="datee">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Date de début"
        />
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Date de fin"
        />
      </div>
      <h2 className="titrechoix">les choix du restaurant</h2>
      <div>
        {restaurants.map((restaurant) => (
          <button
            className="button-74"
            key={restaurant.uuid}
            onClick={() => handleIDSelection(restaurant.uuid)}
          >
            {restaurant.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmitOtpForm}>
        <div className="form-group">
          <label htmlFor="otpInput">OTP:</label>
          <input
            type="text"
            className="form-control"
            id="otpInput"
            value={otp}
            onChange={handleChangeOtp}
            placeholder="Entrez l'OTP"
            maxLength="4"
          />
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Envoi...' : "Soumettre l'OTP"}
        </button>
      </form>
      <h2 className="titrechoix">Devis</h2>
      {/* Afficher l'indicateur de chargement si loading est true */}
      {loading && <div>Loading...</div>}
      {backendData ? (
        <div>
          <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-g©utters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Chiffre d'affaires
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {<p>{backendData.Chiffre_d_affaires}</p>}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Virement Uber
                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <p>
                          Pourcentage :&nbsp;&nbsp;
                          {backendData.Pourcentagevirement} %
                        </p>
                        <p>{backendData.Virement}</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        GAIN du restaurant
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <p>
                          Pourcentage :&nbsp;&nbsp;
                          {backendData.Pourcentage_de_gain} %
                        </p>
                        <p>{backendData.gain}</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        depense a nos livreurs
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <p>
                          Pourcentage :&nbsp;&nbsp;
                          {backendData.PourcentageLIVREURS} %
                        </p>
                        <p>{backendData.Depensedecommande}</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        PUB
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <p>
                          Pourcentage :&nbsp;&nbsp;
                          {backendData.Pourcentagepublicitaires} %
                        </p>
                        <p>{backendData.Dépenses_publicitaires}</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Remboursements
                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <p>
                          Pourcentage :&nbsp;&nbsp;
                          {backendData.PourcentageREMBOURSEMENTS} %
                        </p>
                        <p>{backendData.Remboursements}</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Pourcentage d Uber
                      </div>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            <p>{backendData.PourcentageUber} %</p>
                          </div>
                        </div>
                        <div className="col">
                          <div className="progress progress-sm mr-2">
                            <div
                              className="progress-bar bg-info"
                              role="progressbar"
                              style={{
                                width: `${
                                  backendData && backendData.PourcentageUber
                                    ? backendData.PourcentageUber
                                    : '0'
                                }%`,
                              }}
                              aria-valuenow={
                                backendData && backendData.PourcentageUber
                                  ? backendData.PourcentageUber
                                  : '0'
                              }
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
}

export default App;
