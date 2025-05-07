import React, { useState } from "react";
import styles from "./Network.module.css";
import { Spinner } from "react-activity";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrency } from "../store/action/appStorage";


const allCurrencies = [
  { name: "Afghan Afghani", code: "AFN" },
  { name: "Albanian Lek", code: "ALL" },
  { name: "Algerian Dinar", code: "DZD" },
  { name: "Angolan Kwanza", code: "AOA" },
  { name: "Argentine Peso", code: "ARS" },
  { name: "Armenian Dram", code: "AMD" },
  { name: "Australian Dollar", code: "AUD" },
  { name: "Azerbaijani Manat", code: "AZN" },
  { name: "Bahraini Dinar", code: "BHD" },
  { name: "Bangladeshi Taka", code: "BDT" },
  { name: "Barbadian Dollar", code: "BBD" },
  { name: "Belarusian Ruble", code: "BYN" },
  { name: "Belize Dollar", code: "BZD" },
  { name: "Bermudian Dollar", code: "BMD" },
  { name: "Bhutanese Ngultrum", code: "BTN" },
  { name: "Bolivian Boliviano", code: "BOB" },
  { name: "Bosnia-Herzegovina Convertible Mark", code: "BAM" },
  { name: "Botswana Pula", code: "BWP" },
  { name: "Brazilian Real", code: "BRL" },
  { name: "British Pound", code: "GBP" },
  { name: "Brunei Dollar", code: "BND" },
  { name: "Bulgarian Lev", code: "BGN" },
  { name: "Burundian Franc", code: "BIF" },
  { name: "Canadian Dollar", code: "CAD" },
  { name: "Cape Verdean Escudo", code: "CVE" },
  { name: "Central African CFA Franc", code: "XAF" },
  { name: "Chilean Peso", code: "CLP" },
  { name: "Chinese Yuan", code: "CNY" },
  { name: "Colombian Peso", code: "COP" },
  { name: "Congolese Franc", code: "CDF" },
  { name: "Costa Rican Colón", code: "CRC" },
  { name: "Croatian Kuna", code: "HRK" },
  { name: "Cuban Peso", code: "CUP" },
  { name: "Czech Koruna", code: "CZK" },
  { name: "Danish Krone", code: "DKK" },
  { name: "Djiboutian Franc", code: "DJF" },
  { name: "Dominican Peso", code: "DOP" },
  { name: "East Caribbean Dollar", code: "XCD" },
  { name: "Egyptian Pound", code: "EGP" },
  { name: "Eritrean Nakfa", code: "ERN" },
  { name: "Estonian Kroon", code: "EEK" },
  { name: "Ethiopian Birr", code: "ETB" },
  { name: "Euro", code: "EUR" },
  { name: "Fijian Dollar", code: "FJD" },
  { name: "Gambian Dalasi", code: "GMD" },
  { name: "Georgian Lari", code: "GEL" },
  { name: "Ghanaian Cedi", code: "GHS" },
  { name: "Guatemalan Quetzal", code: "GTQ" },
  { name: "Guinean Franc", code: "GNF" },
  { name: "Haitian Gourde", code: "HTG" },
  { name: "Honduran Lempira", code: "HNL" },
  { name: "Hong Kong Dollar", code: "HKD" },
  { name: "Hungarian Forint", code: "HUF" },
  { name: "Icelandic Krona", code: "ISK" },
  { name: "Indian Rupee", code: "INR" },
  { name: "Indonesian Rupiah", code: "IDR" },
  { name: "Iranian Rial", code: "IRR" },
  { name: "Iraqi Dinar", code: "IQD" },
  { name: "Israeli New Shekel", code: "ILS" },
  { name: "Jamaican Dollar", code: "JMD" },
  { name: "Japanese Yen", code: "JPY" },
  { name: "Jordanian Dinar", code: "JOD" },
  { name: "Kazakhstani Tenge", code: "KZT" },
  { name: "Kenyan Shilling", code: "KES" },
  { name: "Kuwaiti Dinar", code: "KWD" },
  { name: "Kyrgyzstani Som", code: "KGS" },
  { name: "Lao Kip", code: "LAK" },
  { name: "Latvian Lats", code: "LVL" },
  { name: "Lebanese Pound", code: "LBP" },
  { name: "Lesotho Loti", code: "LSL" },
  { name: "Liberian Dollar", code: "LRD" },
  { name: "Libyan Dinar", code: "LYD" },
  { name: "Lithuanian Litas", code: "LTL" },
  { name: "Macanese Pataca", code: "MOP" },
  { name: "Macedonian Denar", code: "MKD" },
  { name: "Malagasy Ariary", code: "MGA" },
  { name: "Malawian Kwacha", code: "MWK" },
  { name: "Malaysian Ringgit", code: "MYR" },
  { name: "Maldivian Rufiyaa", code: "MVR" },
  { name: "Mauritanian Ouguiya", code: "MRU" },
  { name: "Mauritian Rupee", code: "MUR" },
  { name: "Mexican Peso", code: "MXN" },
  { name: "Moldovan Leu", code: "MDL" },
  { name: "Mongolian Tögrög", code: "MNT" },
  { name: "Moroccan Dirham", code: "MAD" },
  { name: "Mozambican Metical", code: "MZN" },
  { name: "Myanmar Kyat", code: "MMK" },
  { name: "Namibian Dollar", code: "NAD" },
  { name: "Nepalese Rupee", code: "NPR" },
  { name: "Netherlands Antillean Guilder", code: "ANG" },
  { name: "New Taiwan Dollar", code: "TWD" },
  { name: "New Zealand Dollar", code: "NZD" },
  { name: "Nicaraguan Córdoba", code: "NIO" },
  { name: "Nigerian Naira", code: "NGN" },
  { name: "North Korean Won", code: "KPW" },
  { name: "Norwegian Krone", code: "NOK" },
  { name: "Omani Rial", code: "OMR" },
  { name: "Pakistani Rupee", code: "PKR" },
  { name: "Panamanian Balboa", code: "PAB" },
  { name: "Papua New Guinean Kina", code: "PGK" },
  { name: "Paraguayan Guarani", code: "PYG" },
  { name: "Peruvian Sol", code: "PEN" },
  { name: "Philippine Peso", code: "PHP" },
  { name: "Polish Złoty", code: "PLN" },
  { name: "Qatari Riyal", code: "QAR" },
  { name: "Romanian Leu", code: "RON" },
  { name: "Russian Ruble", code: "RUB" },
  { name: "Rwandan Franc", code: "RWF" },
  { name: "Saint Helena Pound", code: "SHP" },
  { name: "Samoan Tala", code: "WST" },
  { name: "São Tomé and Príncipe Dobra", code: "STN" },
  { name: "Saudi Riyal", code: "SAR" },
  { name: "Serbian Dinar", code: "RSD" },
  { name: "Seychellois Rupee", code: "SCR" },
  { name: "Sierra Leonean Leone", code: "SLL" },
  { name: "Singapore Dollar", code: "SGD" },
  { name: "Solomon Islands Dollar", code: "SBD" },
  { name: "Somali Shilling", code: "SOS" },
  { name: "South African Rand", code: "ZAR" },
  { name: "South Korean Won", code: "KRW" },
  { name: "Sri Lankan Rupee", code: "LKR" },
  { name: "Sudanese Pound", code: "SDG" },
  { name: "Surinamese Dollar", code: "SRD" },
  { name: "Swazi Lilangeni", code: "SZL" },
  { name: "Swedish Krona", code: "SEK" },
  { name: "Swiss Franc", code: "CHF" },
  { name: "Syrian Pound", code: "SYP" },
  { name: "Tajikistani Somoni", code: "TJS" },
  { name: "Tanzanian Shilling", code: "TZS" },
  { name: "Thai Baht", code: "THB" },
  { name: "Tongan Paʻanga", code: "TOP" },
  { name: "Trinidad and Tobago Dollar", code: "TTD" },
  { name: "Tunisian Dinar", code: "TND" },
  { name: "Turkish Lira", code: "TRY" },
  { name: "Turkmenistani Manat", code: "TMT" },
  { name: "Ugandan Shilling", code: "UGX" },
  { name: "Ukrainian Hryvnia", code: "UAH" },
  { name: "United Arab Emirates Dirham", code: "AED" },
  { name: "Uruguayan Peso", code: "UYU" },
  { name: "Uzbekistani Soʻm", code: "UZS" },
  { name: "Vanuatu Vatu", code: "VUV" },
  { name: "Venezuelan Bolívar", code: "VES" },
  { name: "Vietnamese Đồng", code: "VND" },
  { name: "Yemeni Rial", code: "YER" },
  { name: "Zambian Kwacha", code: "ZMW" },
  { name: "Zimbabwean Dollar", code: "ZWL" },
];


const CurrencyModal = ({ hideModal }) => {

  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.userAuth);


  const dispatch = useDispatch();



  const handleSelect = (e) => {
    const selected = JSON.parse(e.target.value);
    setSelectedCurrency(selected);
    console.log(selected)
  };


  const handleConfirm = async() => {
    setIsLoading(true)
    try {
      setIsLoading(true);
      const res = await dispatch(changeCurrency({...selectedCurrency,user:user}))

      if (!res.bool) {
        setIsAuthError(true);
        setAuthInfo(res.message);
      } else {
        hideModal();
      }

      setIsLoading(false);
    } catch (error) {
      setIsAuthError(true);
      setAuthInfo(error.message);
      setIsLoading(false);
    }
  };





  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalView}>
        <span
          className="material-icons"
          style={{ width: "100%", textAlign: "start", cursor: "pointer" }}
          onClick={() => hideModal()}
        >
          close
        </span>
        <p className={styles.modalState}>Select your currency</p>

        <div className={styles.optionList}>
          <select
            className={styles.option}
            value={selectedCurrency ? JSON.stringify(selectedCurrency) : ""}
            onChange={handleSelect}
          >
            <option value="">-- Select a currency --</option>
            {allCurrencies.map((currency) => (
              <option key={currency.code} value={JSON.stringify(currency)}>
                {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modalButtonContainer}>
        <button className={styles.acceptBtn} onClick={handleConfirm} disabled={!selectedCurrency}>
            {isLoading ? (
              <Spinner size={10} color="#fff" className={styles.loader} style={{ color: "#fff", fill: "#fff", stroke: "#fff" }} />
            ) : (
              "Select"
            )}
          </button>
          {isAuthError && <p style={{ color: "red" }}>{authInfo}</p>}
        </div>
      </div>
    </div>
  );
};

export default CurrencyModal;
