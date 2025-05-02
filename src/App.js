
import React, { useState } from "react";
import emailjs from "emailjs-com";

const products = [
  { id: 1, image: "dysprosium.jpg", name: { pl: "Tlenek Dysprozu", en: "Dysprosium Oxide", de: "Dysprosiumoxid" }, pricePerGram: { PLN: 2.4, USD: 0.6, EUR: 0.56 } },
];

export default function App() {
  const [lang, setLang] = useState("pl");
  const [currency, setCurrency] = useState("PLN");
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleQuantityChange = (id, value) => {
    const val = Math.max(1, Math.min(100000, parseInt(value) || 1));
    setQuantities({ ...quantities, [id]: val });
  };

  const addToCart = (product) => {
    const weight = quantities[product.id] || 1;
    const price = product.pricePerGram[currency] * weight;
    const name = product.name[lang];
    setCart([...cart, { name, weight, price }]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      {
        from_name: name,
        user_email: email,
        message: message,
      },
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>{lang === "pl" ? "Sklep z metalami ziem rzadkich" : "Rare Earth Store"}</h1>

      {products.map((product) => {
        const weight = quantities[product.id] || 1;
        const total = (weight * product.pricePerGram[currency]).toFixed(2);
        return (
          <div key={product.id}>
            <img src={"images/" + product.image} alt={product.name[lang]} width="100" />
            <h2>{product.name[lang]}</h2>
            <p>Cena za 1g: {product.pricePerGram[currency]} {currency}</p>
            <input type="number" value={weight} onChange={(e) => handleQuantityChange(product.id, e.target.value)} min="1" max="100000" />
            <p>Suma: {total} {currency}</p>
            <button onClick={() => addToCart(product)}>Dodaj do koszyka</button>
          </div>
        );
      })}

      <h3>Koszyk:</h3>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>{item.name} - {item.weight}g = {item.price.toFixed(2)} {currency}</li>
        ))}
      </ul>
      <p><strong>Suma: {total} {currency}</strong></p>

      <h3>Kontakt</h3>
      {sent ? <p>Wiadomość została wysłana!</p> : (
        <form onSubmit={sendEmail}>
          <input type="text" placeholder="Imię" value={name} onChange={(e) => setName(e.target.value)} required /><br />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
          <textarea placeholder="Wiadomość" value={message} onChange={(e) => setMessage(e.target.value)} required /><br />
          <button type="submit">Wyślij wiadomość</button>
        </form>
      )}
    </div>
  );
}
