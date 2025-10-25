import { DatedPrice } from "../../typings";
import { printPrice } from "../../utilities/utilities";

interface Props {
  datedPrice: DatedPrice;
}

export default function DatedPriceTag({ datedPrice }: Props) {
  return (
    <div className="text-center border border-slate-200 rounded-md py-1 px-1 text-xs leading-3">
      <div className="p-0.5">{printPrice(datedPrice.price).padEnd(8)}</div>
    </div>
  );
}
