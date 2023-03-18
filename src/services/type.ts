export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type CursorT = Phaser.Types.Input.Keyboard.CursorKeys;

type MonsterConfigT = {
  startX: number;
  startY: number;
};

export type SceneMonstersConfigT = {
  smallMonsters: MonsterConfigT[];
  bigMonsters: MonsterConfigT[];
};
