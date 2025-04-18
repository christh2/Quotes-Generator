import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

// Citations françaises locales
const frenchQuotes = [
  { content: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.", author: "Gandhi" },
  { content: "Le plus grand voyageur n'est pas celui qui a fait dix fois le tour du monde, mais celui qui a fait une seule fois le tour de lui-même.", author: "Mahatma Gandhi" },
  { content: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci" },
  { content: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
  { content: "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.", author: "Nelson Mandela" },
  { content: "La vie est faite de petits bonheurs.", author: "Voltaire" },
  { content: "L'imagination est plus importante que le savoir.", author: "Albert Einstein" },
  { content: "Le temps est un grand maître, le malheur est qu'il tue ses élèves.", author: "Hector Berlioz" },
  { content: "La patience est amère, mais ses fruits sont doux.", author: "Jean-Jacques Rousseau" },
  { content: "L'art de vivre est un subtil mélange entre lâcher prise et tenir bon.", author: "Henri Lewis" }
];

// Sources de citations disponibles
const quoteSources = {
  fr: "Citations Françaises",
  quotable: "quotable",
  lucifer: "Lucifer",
  breakingBad: "Breaking Bad",
  gameOfThrones: "Game of Thrones",
  strangerthings: "Stranger Things",
  kaamelott: "kaamelott"
};

function App() {
  const [quote, setQuote] = useState(() => frenchQuotes[Math.floor(Math.random() * frenchQuotes.length)]);
  const [quoteSource, setQuoteSource] = useState('fr');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtient une nouvelle citation
  const getNewQuote = async () => {
    setLoading(true);
    setError(null);

    if (quoteSource === 'fr') {
      // Citation française depuis le tableau local
      const newQuote = frenchQuotes[Math.floor(Math.random() * frenchQuotes.length)];
      setQuote(newQuote);
      setTimeout(() => setLoading(false), 300);
    } else {
      try {
        let apiUrl;
        let processResponse;

        // Sélection de l'API en fonction de la source choisie
        switch (quoteSource) {
          case 'lucifer':
            apiUrl = 'https://luciferquotes.shadowdev.xyz/api/quotes';
            processResponse = async (response) => {
              const data = await response.json();
              if (data[0] && data[0].quote && data[0].author) {
                return { content: data[0].quote, author: data[0].author };
              }
              throw new Error('Format de réponse inattendu');
            };
            break;

          case 'breakingBad':
            apiUrl = 'https://api.breakingbadquotes.xyz/v1/quotes';
            processResponse = async (response) => {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0 && data[0].quote && data[0].author) {
                return { content: data[0].quote, author: data[0].author };
              }
              throw new Error('Format de réponse inattendu');
            };
            break;

          case 'gameOfThrones':
            apiUrl = 'https://api.gameofthronesquotes.xyz/v1/random';
            processResponse = async (response) => {
              const data = await response.json();
              if (data && data.sentence && data.character && data.character.name) {
                return { content: data.sentence, author: data.character.name };
              }
              throw new Error('Format de réponse inattendu');
            };
            break;

          case 'kaamelott':
            apiUrl = 'https://api.allorigins.win/raw?url=https://kaamelott.chaudie.re/api/random&t=' + new Date().getTime();
            processResponse = async (response) => {
              const data = await response.json();
              console.log(data);
              if (data && data.citation && data.citation.citation && data.citation.infos && data.citation.infos.personnage) {
                return {
                  content: data.citation.citation,
                  author: data.citation.infos.personnage
                };
              }
              throw new Error('Format de réponse inattendu');
            };
            break;

          case 'strangerthings':
            apiUrl = 'https://strangerthingsquotes.shadowdev.xyz/api/quotes';
            processResponse = async (response) => {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0 && data[0].quote && data[0].author) {
                return { content: data[0].quote, author: data[0].author };
              }
              throw new Error('Format de réponse inattendu');
            };
            break;

            case 'quotable':
              apiUrl = 'https://api.allorigins.win/raw?url=https://api.quotable.io/quotes/random&t=' + new Date().getTime();              
              processResponse = async (response) => {
                const data = await response.json();
                console.log(data); // Affiche les données pour vérifier la structure
                
                // Vérifier si la réponse est bien un objet avec 'content' et 'author'
                if (data && data.content && data.author) {
                  return { 
                    content: data.content,
                    author: data.author
                  };
                }
                throw new Error('Format de réponse inattendu');
              };
              break;

          default:
            throw new Error('Source de citation non reconnue');
        }

        // Effectuer la requête API
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Traiter la réponse selon le format de l'API
        const processedQuote = await processResponse(response);

        console.log('API Response processed:', processedQuote);
        setQuote(processedQuote);

      } catch (error) {
        console.log(error);
        console.error(`Erreur lors de la récupération de la citation (${quoteSources[quoteSource]}):`, error);
        setError(`Impossible de charger une citation de ${quoteSources[quoteSource]}. Veuillez réessayer.`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Copie la citation dans le presse-papiers
  const copyQuote = async () => {
    try {
      const textToCopy = `"${quote.content}" - ${quote.author}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Impossible de copier la citation.");
    }
  };

  // Recharge une citation quand la source change
  useEffect(() => {
    getNewQuote();
  }, [quoteSource]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-pink-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Générateur de Citations
        </h1>

        <div className="mb-6">
          <label htmlFor="source-selector" className="block text-sm font-medium text-gray-700 mb-2">
            Choisir une source de citations:
          </label>
          <select
            id="source-selector"
            value={quoteSource}
            onChange={(e) => setQuoteSource(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 w-full md:w-auto"
          >
            {Object.entries(quoteSources).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="text-6xl text-gray-200 absolute top-0 left-0 -translate-x-4 -translate-y-4">❝</div>
          <div
            className="mb-8 transition-all duration-300"
            style={{
              opacity: loading ? 0.5 : 1,
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }}
          >
            {error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : (
              <>
                <p id="quote" className="text-xl md:text-2xl text-gray-700 mb-4 px-8 text-center">
                  {quote.content}
                </p>
                <p id="author" className="text-right text-gray-600 italic">
                  - {quote.author}
                </p>
              </>
            )}
          </div>
          <div className="text-6xl text-gray-200 absolute bottom-0 right-0 translate-x-4 translate-y-4">❞</div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            id="new-quote"
            onClick={getNewQuote}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Chargement...' : 'Nouvelle Citation'}
          </button>

          <button
            id="copy-quote"
            onClick={copyQuote}
            disabled={loading || error}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Citation copiée ! ✅' : 'Copier la citation'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;