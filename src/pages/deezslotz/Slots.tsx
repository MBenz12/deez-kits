import { useState, useEffect } from "react";

type SlotsProps = {
  size: number;
  targets: Array<number>;
  roll: Object;
  assets: string,
  finished: () => void;
};

export const random = () => {
  return Math.floor(Math.random() * 10);
};

const Column = ({
  size,
  target,
  time,
  roll,
  assets,
}: {
  size: number;
  target: number;
  time: number;
  roll: any;
  assets: string;
}) => {
  const [len] = useState(Math.floor(Math.random() * 40 + 30));
  // const [time] = useState(Math.floor(Math.random() * 4000 + 2000));
  const [items, setItems] = useState<Array<number>>(
    (() => {
      const items = [];
      for (let i = 0; i < len; i++) {
        items[i] = random();
      }
      return items;
    })()
  );
  const [pos, setPos] = useState(-size * (len - 3));
  const [duration, setDuration] = useState(time);

  useEffect(() => {
    const len = Math.floor(Math.random() * 40 + 30);
    // const time = Math.floor(Math.random() * 4000 + 2000);

    if (target !== -1) {
      const newItems = [...items];
      for (let i = items.length; i < len; i++) {
        newItems[i] = random();
      }
      newItems[1] = target;
      setItems(newItems);
      setDuration(time);
      setPos(0);
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          newItems[len - 3 + i] = newItems[i];
        }
        setItems(newItems);
        setPos(-size * (len - 3));
        setDuration(0);
      }, time);
    }
  }, [roll]);

  useEffect(() => {
    setPos(-size * (len - 3));
  }, [size]);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 3}px`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          display: "flex",
          flexDirection: "column",
          marginTop: `${pos}px`,
          transitionDuration: `${duration}ms`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{ width: `${size}px`, height: `${size}px`, padding: "8px", overflow: "hidden" }}
          >
            <div className="flex items-center justify-center">
              <img
                className={`rounded-xl w-full h-full`}
                src={`/${assets}/${item + 1}.png`}
                width={size - 16}
                height={size - 16}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Slots = ({ size, targets, roll, assets, finished }: SlotsProps) => {
  const [times, setTimes] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    const times = [];
    let maxTime = 0;
    for (let i = 0; i < 5; i++) {
      times[i] = Math.floor(Math.random() * 4000 + 2000);
      if (maxTime < times[i]) maxTime = times[i];
    }
    setTimes(times);
    if (!targets.includes(-1)) {
      setTimeout(finished, maxTime + 500);
    }
  }, [roll]);
  return (
    <div className="flex justify-center">
      {targets.map((target: number, index: number) => (
        <Column
          key={index}
          size={size}
          target={target}
          time={times[index]}
          roll={roll}
          assets={assets}
        />
      ))}
    </div>
  );
};

export default Slots;
