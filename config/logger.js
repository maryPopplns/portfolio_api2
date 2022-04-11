const winston = require('winston');

let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:MM:SS',
  }),
  winston.format.printf(
    (info) =>
      // ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
      `[ ${info.level} ] : ${info.message}`
  )
);

winston.addColors({
  info: 'blue', // fontStyle color
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green',
});

exports.logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
});
