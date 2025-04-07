import React, { useState } from "react";

import { motion } from "motion/react";
import { Car, Clock, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Order } from "@/src/app/type";

export const CustomKanban = () => {
  return (
    <div className="h-screen w-full">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_ORDERS);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Pending"
        status="pending"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        status="in-progress"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        status="completed"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      {/* <BurnBarrel setCards={setCards} /> */}
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  cards,
  status,
  setCards,
}: {
  title: string;
  headingColor: string;
  cards: Order[];
  status: "pending" | "in-progress" | "completed";
  setCards: React.Dispatch<React.SetStateAction<Order[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent, card: Order): void => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: React.DragEvent): void => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, status };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators: HTMLElement[] = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent): void => {
    const indicators: HTMLElement[] = getIndicators();

    clearHighlights(indicators);

    const el: { offset: number; element: HTMLElement } = getNearestIndicator(
      e,
      indicators
    );

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${status}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.status === status);

  return (
    <div className="shrink-0 w-96">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return (
            <OrderCard key={c.id} task={c} handleDragStart={handleDragStart} />
          );
        })}
        <DropIndicator beforeId={null} status={status} />
      </div>
    </div>
  );
};

const priorityColors = {
  low: "flex gap-2 rounded-xl text-sm h-fit text-green-500 border-green-500/20 bg-green-500/10",
  medium:
    "flex gap-2 rounded-xl text-sm h-fit text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  high: "flex gap-2 rounded-xl text-sm h-fit text-red-500 border-red-500/20 bg-red-500/10",
};

const OrderCard = ({
  task,
  handleDragStart,
}: {
  task: Order;
  handleDragStart: (e: React.DragEvent, card: Order) => void;
}) => {
  return (
    <>
      <DropIndicator beforeId={task.id} status={task.status} />
      <motion.div
        layout
        layoutId={task.id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as React.DragEvent, task)
        }
      >
        <Card className="cursor-pointer">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {task.description}
                </p>
              </div>
              <Badge className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{task.customer.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Car className="h-3.5 w-3.5" />
                <span>
                  {task.vehicle.year} {task.vehicle.make} {task.vehicle.model}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {task.assignedTo && (
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                  />
                  <AvatarFallback className="text-xs">
                    {task.assignedTo.initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

const DropIndicator = ({
  beforeId,
  status,
}: {
  beforeId: string | null;
  status: string;
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={status}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

// const BurnBarrel = ({ setCards }) => {
//   const [active, setActive] = useState(false);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setActive(true);
//   };

//   const handleDragLeave = () => {
//     setActive(false);
//   };

//   const handleDragEnd = (e) => {
//     const cardId = e.dataTransfer.getData("cardId");

//     setCards((pv) => pv.filter((c) => c.id !== cardId));

//     setActive(false);
//   };

//   return (
//     <div
//       onDrop={handleDragEnd}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
//         active
//           ? "border-red-800 bg-red-800/20 text-red-500"
//           : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
//       }`}
//     >
//       {active ? <Flame className="animate-bounce" /> : <Trash2 />}
//     </div>
//   );
// };

const DEFAULT_ORDERS: Order[] = [
  {
    id: "task-1",
    title: "Oil Change",
    description: "Full synthetic oil change and filter replacement",
    customer: {
      name: "John Smith",
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2019,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "pending",
    dueDate: "2023-05-10",
    priority: "medium",
  },
  {
    id: "task-2",
    title: "Brake Replacement",
    description: "Front brake pad and rotor replacement",
    customer: {
      name: "Sarah Williams",
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: 2020,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "in-progress",
    dueDate: "2023-05-11",
    priority: "high",
  },
  {
    id: "task-3",
    title: "Tire Rotation",
    description: "Rotate and balance all tires",
    customer: {
      name: "Robert Johnson",
    },
    vehicle: {
      make: "Ford",
      model: "F-150",
      year: 2021,
    },
    status: "pending",
    priority: "low",
  },
  {
    id: "task-4",
    title: "AC Repair",
    description: "Diagnose and fix AC not cooling",
    customer: {
      name: "Jennifer Lee",
    },
    vehicle: {
      make: "BMW",
      model: "X5",
      year: 2018,
    },
    assignedTo: {
      name: "Alex Turner",
      initials: "AT",
    },
    status: "in-progress",
    dueDate: "2023-05-12",
    priority: "high",
  },
  {
    id: "task-5",
    title: "Battery Replacement",
    description: "Replace battery and test charging system",
    customer: {
      name: "Michael Brown",
    },
    vehicle: {
      make: "Chevrolet",
      model: "Malibu",
      year: 2017,
    },
    status: "completed",
    priority: "medium",
  },
  {
    id: "task-6",
    title: "Transmission Service",
    description: "Flush and replace transmission fluid",
    customer: {
      name: "David Wilson",
    },
    vehicle: {
      make: "Nissan",
      model: "Altima",
      year: 2020,
    },
    assignedTo: {
      name: "Chris Adams",
      initials: "CA",
    },
    status: "completed",
    dueDate: "2023-05-09",
    priority: "medium",
  },
];
