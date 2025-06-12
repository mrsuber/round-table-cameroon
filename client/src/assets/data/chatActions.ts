export interface chatActionsProps {
  id: number;
  label: string;
}

export enum chatActionsEnumn {
  REPLY = 'Reply',
  REACT = 'React',
  FORWARD = 'Forward',
  DELETE = 'Delete',
}

export const chatActions: chatActionsProps[] = [
  {
    id: 0,
    label: chatActionsEnumn.REPLY,
  },
  {
    id: 1,
    label: chatActionsEnumn.REACT,
  },
  {
    id: 2,
    label: chatActionsEnumn.FORWARD,
  },
  {
    id: 3,
    label: chatActionsEnumn.DELETE,
  },
];
