export function arrToMap(array) {
  return array.reduce(
    (acc, object) => ({
      ...acc,
      [object.id]: object,
    }),
    {}
  );
}

export const compose = (...fns) =>
  fns.reduce(
    (acc, f) => (x) => f(acc(x)),
    (x) => x
  );

export const flip = (f) => (a, b) => f(b, a);

export const curry = (f) => (a) => (b) => f(a, b);

export const calculateSettledPrice = ({ buyOrder, sellOrder }) =>
  Math.floor((buyOrder.price + sellOrder.price) / 2);
