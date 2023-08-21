import { ReactNode, useState } from "react";


type SelectorProps = {
  options: {
    name: string;
    element: ReactNode;
  }[];
};

export const Selector = ({ options }: SelectorProps) => {
  const [optionSelected, setOptionSelected] = useState<number>(0);

  if (options.length < 1) throw new Error("Selector needs at least one option");

  return (
    <div className="flex flex-col gap-4">
      {options.length > 1 ? (
        <>
          <div className="flex flex-row gap-4 items-center justify-center">
            {options.map(({ name }, idx) => (
              <button
                className={`${
                  optionSelected === idx
                    ? "bg-dark-blue text-white"
                    : "bg-white text-dark-blue"
                } border-2 border-dark-blue  rounded-lg font-bold w-full py-1 text-lg`}
                onClick={() => setOptionSelected(idx)}
              >
                {name}
              </button>
            ))}
          </div>
          {options[optionSelected].element}
        </>
      ) : (
        options[optionSelected].element
      )}
    </div>
  );
};
