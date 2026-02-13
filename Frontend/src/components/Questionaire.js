import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";

const Questionaire = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [totalemission, setTotalemission] = useState(0);
    const [submitstatus, setSubmitstatus] = useState(null);
    const handleCheckbox = (category, activity, checked) => {
        setForm(prev => {
            const updated = { ...prev };
            if (!updated[category]) updated[category] = {};

            if (checked) updated[category][activity] = 0;
            else {
                delete updated[category][activity];
                if (Object.keys(updated[category]).length === 0) delete updated[category];
            }
            return updated;
        });
    };

    const handleQuantity = (category, activity, value) => {
        setForm(prev => {
            if (!prev[category] || !(activity in prev[category])) return prev;
            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [activity]: Number(value)
                }
            };
        });
    };
    const formRef = useRef(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("Payload:", form);
            const token = localStorage.getItem('token')
            const response = await fetch("http://localhost:5000/questionaire", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                setTotalemission(data.totalEmission);
                setSubmitstatus({ type: 'success', message: 'Calculation Completed' })
                setTimeout(()=>{navigate('/dashboard')},300);
            }
        } catch (e) {
            setSubmitstatus({type:'error',message:`${e.message}`})
        }
        finally {
            formRef.current.reset();
            setForm({});
        }

    };

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <h2>Carbon Footprint Questionnaire</h2>

            {/* FOOD */}
            <fieldset>
                <legend>Food (kg/month)</legend>
                {["Rice", "Wheat", "Pulses", "Eggs", "Mutton", "Chicken", "Milk", "Vegetables Average", "Fruits Average"].map(item => (
                    <div key={item}>
                        <input
                            type="checkbox"
                            onChange={e => handleCheckbox("Food", item, e.target.checked)}
                        />
                        {item}
                        <input
                            type="number"
                            placeholder="kg"
                            onChange={e => handleQuantity("Food", item, e.target.value)}
                        />
                    </div>
                ))}
            </fieldset>

            {/* COOKING */}
            <fieldset>
                <legend>Cooking Fuel</legend>
                {[
                    ["Kerosene Fuel", "litres"],
                    ["Firewood", "kg"],
                    ["LPG Cooking Gas", "kg"]
                ].map(([fuel, unit]) => (
                    <div key={fuel}>
                        <input
                            type="checkbox"
                            onChange={e =>
                                handleCheckbox("Cooking", fuel, e.target.checked)
                            }
                        />
                        {fuel}
                        <input
                            type="number"
                            placeholder={unit}
                            onChange={e =>
                                handleQuantity("Cooking", fuel, e.target.value)
                            }
                        />
                    </div>
                ))}
            </fieldset>

            {/* ELECTRICITY */}
            <fieldset>
                <legend>Electricity</legend>
                <input
                    type="number"
                    placeholder="kWh/month"
                    onChange={e =>
                        setForm(prev => ({
                            ...prev,
                            Electricity: { "Electricity Consumption": Number(e.target.value) }
                        }))
                    }
                />
            </fieldset>

            {/* TRANSPORT */}
            <fieldset>
                <legend>Transport</legend>
                {[
                    ["Train Travel", "km"],
                    ["Domestic Flight", "km"],
                    ["Petrol Fuel", "litres"],
                    ["Diesel Fuel", "litres"],
                    ["CNG Fuel", "kg"],
                    ["Auto Rickshaw", "km"],
                    ["Metro Rail", "km"]
                ].map(([mode, unit]) => (
                    <div key={mode}>
                        <input
                            type="checkbox"
                            onChange={e =>
                                handleCheckbox("Transport", mode, e.target.checked)
                            }
                        />
                        {mode}
                        <input
                            type="number"
                            placeholder={unit}
                            onChange={e =>
                                handleQuantity("Transport", mode, e.target.value)
                            }
                        />
                    </div>
                ))}
            </fieldset>

            {/* GOODS */}
            <fieldset>
                <legend>Goods & Purchases</legend>
                {[
                    ["Furniture", "₹ spent"],
                    ["Online Delivery", "no. of deliveries"]
                ].map(([item, unit]) => (
                    <div key={item}>
                        <input
                            type="checkbox"
                            onChange={e => handleCheckbox("Goods", item, e.target.checked)}
                        />
                        {item}
                        <input
                            type="number"
                            placeholder={unit}
                            onChange={e => handleQuantity("Goods", item, e.target.value)}
                        />
                    </div>
                ))}
            </fieldset>

            {/* WASTE */}
            <fieldset>
                <legend>Waste (kg/month)</legend>
                {[
                    "Mixed Waste Landfill",
                    "Food Waste",
                    "Recycled Waste"
                ].map(waste => (
                    <div key={waste}>
                        <input
                            type="checkbox"
                            onChange={e => handleCheckbox("Waste", waste, e.target.checked)}
                        />
                        {waste}
                        <input
                            type="number"
                            placeholder="kg"
                            onChange={e =>
                                handleQuantity("Waste", waste, e.target.value)
                            }
                        />
                    </div>
                ))}
            </fieldset>

            {/* HOUSING */}
            <fieldset>
                <legend>Housing & Construction</legend>
                {[["No Construction", "kg"], ["Minor Repair", "kg"], ["Moderate Renovation", "kg"], ["Major Renovation", "kg"], ["New Construction (Low)", "m2"], ["New Construction (Medium)", "m2"], ["New Construction (Heavy)", "m2"]].map(([construction, unit]) => (
                    <div key={construction}>
                        <input type="radio" onChange={e => handleCheckbox("Housing", construction, e.target.checked)} name="housing"/>
                        {construction}
                        {unit === "m2" ? (<input type="number"
                            placeholder={unit}
                            onChange={e => handleQuantity("Housing", construction, e.target.value)} />) : (<></>)}
                    </div>))}
            </fieldset>

            <button type="submit">Calculate Emissions</button>
            {submitstatus?<p>{submitstatus.message}</p>:''}
            <p>{totalemission ? totalemission : ''}</p>
        </form>
    );
};

export default Questionaire;
