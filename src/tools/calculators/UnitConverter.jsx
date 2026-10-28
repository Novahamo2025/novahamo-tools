import { useState } from 'react';
import { ArrowRightLeft, RotateCcw } from 'lucide-react';

const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    base: 'm',
    units: {
      mm: { name: 'Millimeter (mm)', rate: 0.001 },
      cm: { name: 'Centimeter (cm)', rate: 0.01 },
      m: { name: 'Meter (m)', rate: 1 },
      km: { name: 'Kilometer (km)', rate: 1000 },
      inch: { name: 'Inch (in)', rate: 0.0254 },
      foot: { name: 'Foot (ft)', rate: 0.3048 },
      yard: { name: 'Yard (yd)', rate: 0.9144 },
      mile: { name: 'Mile (mi)', rate: 1609.344 },
    },
  },
  mass: {
    name: 'Mass & Weight',
    base: 'kg',
    units: {
      mg: { name: 'Milligram (mg)', rate: 0.000001 },
      g: { name: 'Gram (g)', rate: 0.001 },
      kg: { name: 'Kilogram (kg)', rate: 1 },
      tonne: { name: 'Metric Tonne (t)', rate: 1000 },
      ounce: { name: 'Ounce (oz)', rate: 0.0283495 },
      pound: { name: 'Pound (lb)', rate: 0.453592 },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      c: { name: 'Celsius (°C)' },
      f: { name: 'Fahrenheit (°F)' },
      k: { name: 'Kelvin (K)' },
    },
  },
  area: {
    name: 'Area',
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meter (m²)', rate: 1 },
      sqkm: { name: 'Square Kilometer (km²)', rate: 1000000 },
      sqft: { name: 'Square Foot (ft²)', rate: 0.092903 },
      acre: { name: 'Acre (ac)', rate: 4046.86 },
      hectare: { name: 'Hectare (ha)', rate: 10000 },
    },
  },
  digital: {
    name: 'Digital Storage',
    base: 'b',
    units: {
      b: { name: 'Bytes (B)', rate: 1 },
      kb: { name: 'Kilobytes (KB)', rate: 1024 },
      mb: { name: 'Megabytes (MB)', rate: 1048576 },
      gb: { name: 'Gigabytes (GB)', rate: 1073741824 },
      tb: { name: 'Terabytes (TB)', rate: 1099511627776 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState(1000);

  const catData = UNIT_CATEGORIES[category];

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const keys = Object.keys(UNIT_CATEGORIES[newCat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return '—';

    if (category === 'temperature') {
      if (fromUnit === toUnit) return v;
      let celsius = v;
      if (fromUnit === 'f') celsius = (v - 32) * (5 / 9);
      if (fromUnit === 'k') celsius = v - 273.15;

      if (toUnit === 'c') return celsius.toFixed(2);
      if (toUnit === 'f') return (celsius * (9 / 5) + 32).toFixed(2);
      if (toUnit === 'k') return (celsius + 273.15).toFixed(2);
      return '—';
    }

    const fromRate = catData.units[fromUnit]?.rate || 1;
    const toRate = catData.units[toUnit]?.rate || 1;
    const inBase = v * fromRate;
    const converted = inBase / toRate;

    return Number(converted.toPrecision(8)).toString();
  };

  const swap = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="select-field" value={category} onChange={e => handleCategoryChange(e.target.value)}>
          {Object.entries(UNIT_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-3)', alignItems: 'center' }}>
        <div className="form-group">
          <label className="form-label">From Unit</label>
          <select className="select-field" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
            {Object.entries(catData.units).map(([k, u]) => (
              <option key={k} value={k}>{u.name}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={swap} style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2)' }}>
          <ArrowRightLeft size={16} />
        </button>

        <div className="form-group">
          <label className="form-label">To Unit</label>
          <select className="select-field" value={toUnit} onChange={e => setToUnit(e.target.value)}>
            {Object.entries(catData.units).map(([k, u]) => (
              <option key={k} value={k}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Value to Convert</label>
        <input
          type="number"
          className="input-field"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      <div className="tool-result">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Converted Value</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>
            {convert()} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{toUnit}</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {value} {fromUnit} = {convert()} {toUnit}
          </p>
        </div>
      </div>
    </div>
  );
}
