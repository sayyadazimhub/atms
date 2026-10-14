// Agricultural & General Unit Conversion Factors
export const WEIGHT_FACTORS = {
  KG: 1,
  Quintal: 100, // 1 Quintal = 100 KG
  Ton: 1000,    // 1 Metric Ton = 1000 KG
  Bag: 50,      // 1 Standard Agri Bag (Bori) = 50 KG
  Gram: 0.001,  // 1 Gram = 0.001 KG
};

export const VOLUME_FACTORS = {
  Litre: 1,
  MilliLitre: 0.001,
};

export const COUNT_FACTORS = {
  Piece: 1,
  Crate: 1,
  Box: 1,
};

/**
 * Returns the conversion multiplier to convert from transactionUnit to productBaseUnit.
 * E.g. getConversionFactor('Quintal', 'KG') => 100
 * E.g. getConversionFactor('KG', 'Quintal') => 0.01
 */
export function getConversionFactor(fromUnit, toUnit) {
  if (!fromUnit || !toUnit || fromUnit === toUnit) return 1;

  if (WEIGHT_FACTORS[fromUnit] !== undefined && WEIGHT_FACTORS[toUnit] !== undefined) {
    return WEIGHT_FACTORS[fromUnit] / WEIGHT_FACTORS[toUnit];
  }

  if (VOLUME_FACTORS[fromUnit] !== undefined && VOLUME_FACTORS[toUnit] !== undefined) {
    return VOLUME_FACTORS[fromUnit] / VOLUME_FACTORS[toUnit];
  }

  if (COUNT_FACTORS[fromUnit] !== undefined && COUNT_FACTORS[toUnit] !== undefined) {
    return COUNT_FACTORS[fromUnit] / COUNT_FACTORS[toUnit];
  }

  return 1;
}

/**
 * Returns list of compatible unit options for a given product base unit
 */
export function getCompatibleUnits(baseUnit) {
  const normBase = baseUnit || 'KG';

  if (WEIGHT_FACTORS[normBase] !== undefined) {
    return [
      { value: 'KG', label: 'KG (Kilogram)' },
      { value: 'Quintal', label: 'Quintal (100 KG)' },
      { value: 'Ton', label: 'Ton (1,000 KG)' },
      { value: 'Bag', label: 'Bag (50 KG)' },
      { value: 'Gram', label: 'Gram (gm)' },
    ];
  }

  if (VOLUME_FACTORS[normBase] !== undefined) {
    return [
      { value: 'Litre', label: 'Litre (Ltr)' },
      { value: 'MilliLitre', label: 'MilliLitre (ml)' },
    ];
  }

  if (COUNT_FACTORS[normBase] !== undefined) {
    return [
      { value: 'Piece', label: 'Piece (Nos)' },
      { value: 'Crate', label: 'Crate / Box' },
      { value: 'Box', label: 'Box / Carton' },
    ];
  }

  return [{ value: normBase, label: normBase }];
}
