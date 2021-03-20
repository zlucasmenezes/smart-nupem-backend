import { ISensorType } from '../models/sensor.model';

export const defaultSensorTypes: Partial<ISensorType>[] = [
  /* THEMISTOR NTC */
  {
    function:
      'var resistance = ((resolution*10000/value) - Rn);\nvar temperature = resistance / Rn;\ntemperature = Math.log(temperature);\ntemperature /= beta;\ntemperature += 1.0 / (Tn + 273.15);\ntemperature = 1 / temperature;\ntemperature -= 273.15;\n return temperature;',
    type: 'Thermistor NTC',
    input: 'Analog',
    status: true,
    config: [
      {
        parameter: 'Rn',
        description: 'Nominal resistance of NTC at nominal temperature',
        default: 10000,
      },
      {
        parameter: 'Tn',
        description: 'Nominal temperature',
        default: 25,
      },
      {
        parameter: 'beta',
        description: 'Beta',
        default: 4300,
      },
      {
        parameter: 'Rs',
        description: 'Series resistor',
        default: 10000,
      },
    ],
  },

  /* GENERAL ANALOG SENSOR */
  {
    type: 'General Analog Sensor',
    input: 'Analog',
    status: true,
  },

  /* LIGHTING */
  {
    function: 'const result = (value/resolution) * 100;\nif (result >= L) { \n  return true;\n} else { \n  return false;\n}\n',
    type: 'Lighting',
    input: 'Analog',
    status: true,
    config: [
      {
        parameter: 'L',
        description: 'Lighting index based on board reading (in percent)',
        default: 30,
      },
    ],
  },
];
