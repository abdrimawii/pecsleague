export interface Player {
  name: string;
  position: string;
}

export interface PlayersDatabase {
  potatoes: Player[];
  knights: Player[];
  easternelite: Player[];
  polarbears: Player[];
  panthers: Player[];
}

export const playersDatabase: PlayersDatabase = {
  potatoes: [
    { name: "Lennard", position: "GK" },
    { name: "Nico", position: "CB" },
    { name: "David", position: "LB" },
    { name: "Arne", position: "LB" },
    { name: "Benni", position: "CB" },
    { name: "Julius N.", position: "CB" },
    { name: "Julius", position: "CB" },
    { name: "Paul", position: "CB" },
    { name: "Felix", position: "RB" },
    { name: "Linus", position: "RB" },
    { name: "Lukas", position: "RW" },
    { name: "Hans", position: "RW" },
    { name: "Adam", position: "CM" },
    { name: "Jakob", position: "CM" },
    { name: "Julen", position: "CM" },
    { name: "Jona", position: "CM" },
    { name: "Flo", position: "CM" },
    { name: "Maurice", position: "CM" },
    { name: "Matin", position: "CM" },
    { name: "Lars", position: "LW" },
    { name: "Dominik", position: "RW" },
    { name: "Consti", position: "LW" },
    { name: "Dirk", position: "ST" },
    { name: "Jonas", position: "ST" }
  ],
  knights: [
    { name: "Mohannad Besani", position: "ST" },
    { name: "Eyas Besani", position: "LW" },
    { name: "Amr Al Sebaie", position: "RW" },
    { name: "Younes", position: "CM" },
    { name: "Youssef", position: "CM" },
    { name: "Moli", position: "CM" },
    { name: "Abdelrahman", position: "LB" },
    { name: "Belal", position: "CB" },
    { name: "Rimawi", position: "CB" },
    { name: "Nour", position: "RB" },
    { name: "Debsi", position: "GK" },
    { name: "Sawalha", position: "ST" },
    { name: "Mostafa Al Sebaie", position: "CB" },
    { name: "Omar Ibrahim", position: "ST" },
    { name: "Nabeel Al Ali", position: "CM" }
  ],
  easternelite: [
    { name: "Vakha Elimkhanov", position: "ST" },
    { name: "Nicolas Dueñas", position: "LW" },
    { name: "Demetris Demosthenous", position: "RW" },
    { name: "Jessus Garzon", position: "CM" },
    { name: "Abdulmalek Rashed", position: "CM" },
    { name: "Tenger Mendsaikhn", position: "CM" },
    { name: "Ryuske Honda", position: "LB" },
    { name: "Efe Erpay", position: "CB" },
    { name: "Antreas Soteriou", position: "CB" },
    { name: "Lasha Mdivani", position: "RB" },
    { name: "Guille Cappuccini", position: "GK" }
  ],
  polarbears: [
    { name: "Ali Pourhamid", position: "ST" },
    { name: "Kristoffer Augland", position: "LW" },
    { name: "Pål Gjeruldsen", position: "RW" },
    { name: "Alisina Dabestani", position: "CM" },
    { name: "Edvard Ferstad", position: "CM" },
    { name: "William Schmidt", position: "CM" },
    { name: "David Ribaitis", position: "LB" },
    { name: "Kristian Bihlet", position: "RB" },
    { name: "Simen Lyster", position: "CB" },
    { name: "Wali Awan", position: "CB" },
    { name: "Audun Fladvad", position: "GK" },
    { name: "Daniel Mo", position: "RB" },
    { name: "Benjamin Kjørholt", position: "ST" },
    { name: "Lauritz Lund-Hanssen", position: "LW" },
    { name: "Habane Ali Abdi", position: "CM" },
    { name: "Shaya Irandoust", position: "CM" }
  ],
  panthers: [
    { name: "Unknown", position: "ST" },
    { name: "Unknown", position: "LW" },
    { name: "Unknown", position: "RW" },
    { name: "Unknown", position: "CM" },
    { name: "Unknown", position: "CM" },
    { name: "Unknown", position: "CM" },
    { name: "Unknown", position: "LB" },
    { name: "Unknown", position: "CB" },
    { name: "Unknown", position: "CB" },
    { name: "Unknown", position: "RB" },
    { name: "Unknown", position: "GK" }
  ]
};
