import Dinero from "dinero.js";
import _ from "lodash/object";

export const toDinero = (value, padWithPrecisionZeros = false) => {
    /* Pad while respecting the precsison */
    const pad = (x, p) => {
        return Number.parseInt(String(x) + "00");
    };

    let opts = { amount: 0, currency: "NGN", precision: 2 };

    if (typeof value === "number") opts.amount = value;
    else if (typeof value === "object")
        opts = { opts, ..._.pick(value, ["amount", "currency", "precision"]) };

    if (padWithPrecisionZeros) opts.amount = pad(opts.amount, opts.precision);

    return Dinero({ ...opts });
};

export const stripPrecision = value => {
    const val = value.getAmount().toString();
    return Number.parseInt(val.substr(0, val.length - value.getPrecision()));
};
