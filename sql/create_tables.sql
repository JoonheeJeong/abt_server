CREATE TABLE business_organization (
    busiId      char(2) PRIMARY KEY,
    busiNm      varchar(48),                --name
    busiCall    varchar(24)                 --call number
);

CREATE TABLE station (
    statId      char(8) PRIMARY KEY,
    statNm      varchar(96) NOT NULL,       --name
    addr        varchar(160) NOT NULL,      --address
    lat         double precision NOT NULL,  --latitude
    lng         double precision NOT NULL,  --longitude
    useTime     varchar(80),                --available time
    powerType   varchar(24),                --power supplying type
    zcode       integer,                    --location code number
    parkingFree boolean,                    --is parking free?
    note        varchar(128),               --something else
    busiId      char(2) REFERENCES business_organization
);

CREATE TABLE charger (
    statId      char(8) REFERENCES station,
    chgerId     varchar(2),
    chgerType   varchar(2) NOT NULL,        --charging type
    stat        char(1) NOT NULL,           --status
    statUpdDt   char(14),                   --status update time
    PRIMARY KEY (chgerId, statId)
);

CREATE TABLE reservation (
    statId  char(8),
    chgerId varchar(2),
    stat    char(1) NOT NULL,
    time_0  boolean,
    time_1  boolean,
    time_2  boolean,
    time_3  boolean,
    time_4  boolean,
    time_5  boolean,
    time_6  boolean,
    time_7  boolean,
    time_8  boolean,
    time_9  boolean,
    time_10 boolean,
    time_11 boolean,
    time_12 boolean,
    time_13 boolean,
    time_14 boolean,
    time_15 boolean,
    time_16 boolean,
    time_17 boolean,
    time_18 boolean,
    time_19 boolean,
    time_20 boolean,
    time_21 boolean,
    time_22 boolean,
    time_23 boolean,
    PRIMARY KEY (statId, chgerId),
    FOREIGN KEY (statId, chgerId) REFERENCES charger (statId, chgerId)
);

