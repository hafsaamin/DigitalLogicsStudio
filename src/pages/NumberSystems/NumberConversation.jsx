import React, { useState } from 'react';
import NSLayout from './components/NSLayout';
import { QuaternarySection } from '../../components/Quaternary Section';

export default function NumberConverter() {
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hexadecimal, setHexadecimal] = useState('');
    const [selectedConversion, setSelectedConversion] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const convertFractionalPart = (fractional, base, precision = 8) => {
        let result = '';
        let steps = [];
        let value = fractional;
        for (let i = 0; i < precision && value > 0; i++) {
            value *= base;
            const digit = Math.floor(value);
            result += digit.toString(base).toUpperCase();
            steps.push({ step: i + 1, digit, remaining: value - digit });
            value = value - digit;
        }
        return { result, steps };
    };

    const fractionalToDecimal = (fractionalStr, base) => {
        let result = 0;
        const steps = [];
        for (let i = 0; i < fractionalStr.length; i++) {
            const digit = parseInt(fractionalStr[i], base);
            const power = -(i + 1);
            const value = digit * Math.pow(base, power);
            result += value;
            steps.push({ position: i + 1, digit: fractionalStr[i] });
        }
        return { result, steps };
    };

    const updateFromDecimal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?\d*\.?\d*$/.test(value)) return;
        const num = parseFloat(value);
        if (isNaN(num)) return;
        setDecimal(value);
        const [intPart, fracPart] = value.split('.');
        const intNum = parseInt(intPart) || 0;
        if (fracPart !== undefined) {
            const fracValue = parseFloat('0.' + fracPart);
            const binInt = Math.abs(intNum).toString(2);
            const binFrac = convertFractionalPart(fracValue, 2).result;
            setBinary((intNum < 0 ? '-' : '') + binInt + (binFrac ? '.' + binFrac : ''));
            const octInt = Math.abs(intNum).toString(8);
            const octFrac = convertFractionalPart(fracValue, 8).result;
            setOctal((intNum < 0 ? '-' : '') + octInt + (octFrac ? '.' + octFrac : ''));
            const hexInt = Math.abs(intNum).toString(16).toUpperCase();
            const hexFrac = convertFractionalPart(fracValue, 16).result;
            setHexadecimal((intNum < 0 ? '-' : '') + hexInt + (hexFrac ? '.' + hexFrac : ''));
        } else {
            setBinary(intNum.toString(2));
            setOctal(intNum.toString(8));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromBinary = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[01]*\.?[01]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 2) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 2).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setBinary(value);
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 2).result;
            setOctal((value.startsWith('-') ? '-' : '') + intNum.toString(8) + ('.' + convertFractionalPart(fracValue, 8).result || ''));
            setHexadecimal((value.startsWith('-') ? '-' : '') + intNum.toString(16).toUpperCase() + ('.' + convertFractionalPart(fracValue, 16).result || ''));
        } else {
            setOctal(intNum.toString(8));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromOctal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[0-7]*\.?[0-7]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 8) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 8).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setOctal(value);
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 8).result;
            setBinary((value.startsWith('-') ? '-' : '') + intNum.toString(2) + ('.' + convertFractionalPart(fracValue, 2).result || ''));
            setHexadecimal((value.startsWith('-') ? '-' : '') + intNum.toString(16).toUpperCase() + ('.' + convertFractionalPart(fracValue, 16).result || ''));
        } else {
            setBinary(intNum.toString(2));
            setHexadecimal(intNum.toString(16).toUpperCase());
        }
    };

    const updateFromHexadecimal = (value) => {
        if (value === '') { setDecimal(''); setBinary(''); setOctal(''); setHexadecimal(''); return; }
        if (!/^-?[0-9A-Fa-f]*\.?[0-9A-Fa-f]*$/.test(value)) return;
        const [intPart, fracPart] = value.replace('-', '').split('.');
        const intNum = intPart ? parseInt(intPart, 16) : 0;
        let decimalValue = intNum;
        if (fracPart) decimalValue += fractionalToDecimal(fracPart, 16).result;
        if (value.startsWith('-')) decimalValue = -decimalValue;
        setDecimal(decimalValue.toString());
        setHexadecimal(value.toUpperCase());
        if (fracPart) {
            const fracValue = fractionalToDecimal(fracPart, 16).result;
            setBinary((value.startsWith('-') ? '-' : '') + intNum.toString(2) + ('.' + convertFractionalPart(fracValue, 2).result || ''));
            setOctal((value.startsWith('-') ? '-' : '') + intNum.toString(8) + ('.' + convertFractionalPart(fracValue, 8).result || ''));
        } else {
            setBinary(intNum.toString(2));
            setOctal(intNum.toString(8));
        }
    };

    const conversions = [
        { id: 'bin-to-dec', label: 'Binary → Decimal' },
        { id: 'bin-to-oct', label: 'Binary → Octal' },
        { id: 'bin-to-hex', label: 'Binary → Hexadecimal' },
        { id: 'dec-to-bin', label: 'Decimal → Binary' },
        { id: 'dec-to-oct', label: 'Decimal → Octal' },
        { id: 'dec-to-hex', label: 'Decimal → Hexadecimal' },
        { id: 'oct-to-bin', label: 'Octal → Binary' },
        { id: 'oct-to-dec', label: 'Octal → Decimal' },
        { id: 'oct-to-hex', label: 'Octal → Hexadecimal' },
        { id: 'hex-to-bin', label: 'Hexadecimal → Binary' },
        { id: 'hex-to-dec', label: 'Hexadecimal → Decimal' },
        { id: 'hex-to-oct', label: 'Hexadecimal → Octal' },
    ];

    const getExplanation = (conversion) => {
        const examples = { decimal: decimal || '42', binary: binary || '101010', octal: octal || '52', hexadecimal: hexadecimal || '2A' };
        return { title: conversion.label + ' Conversion', steps: [`Converting ${Object.values(examples).filter(Boolean)[0]} — type a value above to see live steps.`] };
    };

    const handleConversionClick = (conversion) => { setSelectedConversion(conversion); setShowExplanation(true); };

    return (
        <NSLayout
            title="Number Conversion"
            subtitle="Real-time conversion between binary, octal, decimal, and hexadecimal"
            intro="Type any value in any base and all four representations update instantly. Use the learn panel below for step-by-step conversion guides."
        >
            {/* Converter Boxes */}
            <div className="converter-grid">
                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon decimal">10</div>
                        <h2 className="card-title decimal">DECIMAL</h2>
                    </div>
                    <input className="converter-input" type="text" value={decimal}
                        onChange={(e) => updateFromDecimal(e.target.value)} placeholder="Enter decimal..." />
                    <p className="card-info">Base 10 • Digits: 0-9</p>
                </div>

                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon binary">2</div>
                        <h2 className="card-title binary">BINARY</h2>
                    </div>
                    <input className="converter-input" type="text" value={binary}
                        onChange={(e) => updateFromBinary(e.target.value)} placeholder="Enter binary..." />
                    <p className="card-info">Base 2 • Digits: 0-1</p>
                </div>

                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon octal">8</div>
                        <h2 className="card-title octal">OCTAL</h2>
                    </div>
                    <input className="converter-input" type="text" value={octal}
                        onChange={(e) => updateFromOctal(e.target.value)} placeholder="Enter octal..." />
                    <p className="card-info">Base 8 • Digits: 0-7</p>
                </div>

                <div className="converter-card">
                    <div className="card-header">
                        <div className="base-icon hexadecimal">16</div>
                        <h2 className="card-title hexadecimal">HEXADECIMAL</h2>
                    </div>
                    <input className="converter-input" type="text" value={hexadecimal}
                        onChange={(e) => updateFromHexadecimal(e.target.value)} placeholder="Enter hex..." />
                    <p className="card-info">Base 16 • Digits: 0-9, A-F</p>
                </div>
            </div>

            {/* Explanation Section */}
            <div className="explanation-section">
                <div className="explanation-header">
                    <h2 className="explanation-title">LEARN CONVERSIONS</h2>
                    <p className="explanation-subtitle">Click any conversion to see a detailed step-by-step explanation</p>
                </div>

                <div className="conversion-grid">
                    {conversions.map((conversion) => (
                        <button key={conversion.id} className="conversion-btn"
                            onClick={() => handleConversionClick(conversion)}>
                            {conversion.label}
                        </button>
                    ))}
                </div>

                {showExplanation && selectedConversion && (
                    <div className="modal-overlay" onClick={() => setShowExplanation(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setShowExplanation(false)}>×</button>
                            <h3 className="modal-title">{getExplanation(selectedConversion).title}</h3>
                            <div className="steps-container">
                                {getExplanation(selectedConversion).steps.map((step, index) => (
                                    <div key={index} className={`step-item ${index % 2 === 0 ? 'even' : 'odd'}`}>{step}</div>
                                ))}
                            </div>
                            <div className="pro-tip">
                                <p className="pro-tip-label">💡 Pro Tip</p>
                                <p className="pro-tip-text">
                                    Try entering different values in the converter boxes above to see how numbers change across different bases in real-time!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <QuaternarySection />
        </NSLayout>
    );
}
