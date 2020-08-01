# SQL commands

CREATE TABLE [Airports_Final_CS] (
		[id] nvarchar (3) PRIMARY KEY ,
        [name] nvarchar (100) NOT NULL ,
		[lng] real NULL ,
		[lat] real NULL, 
        [city] nvarchar (100) NULL ,
		[country] nvarchar (100) NULL 
)


CREATE TABLE [Airlines_Final_CS] (
		[id] nvarchar (100) PRIMARY KEY ,
        [name] nvarchar (100) NOT NULL
)


CREATE TABLE [MyFlights_Final_CS] (
		[id] nvarchar (300) PRIMARY KEY ,
        [from] nvarchar (3) NOT NULL ,
		[to] nvarchar (3) NOT NULL ,
		[departuretime] datetime NOT NULL ,
		[arrivaltime] datetime NOT NULL ,
		[flyduration] nvarchar (100) NOT NULL ,
		[price] real NULL, 
		[numstops] nvarchar (100) NULL ,
		CONSTRAINT fk1 FOREIGN KEY ([from]) REFERENCES Airports_Final_CS([id]),
		CONSTRAINT fk2 FOREIGN KEY ([to]) REFERENCES Airports_Final_CS([id])
)


CREATE TABLE [Legs_Final_CS] (
		[id] nvarchar (100) NOT NULL ,
		[tripid] nvarchar (300) NOT NULL ,
		[legnum] int NOT NULL ,
		[flightno] nvarchar (100) NOT NULL ,
        [from] nvarchar (3) NOT NULL ,
		[to] nvarchar (3) NOT NULL ,
		[airlinecode] nvarchar (100) NOT NULL ,
		[departuretime] datetime NOT NULL ,
		[arrivaltime] datetime NOT NULL ,
		[flyduration] nvarchar (100) NOT NULL ,
		CONSTRAINT fk3 PRIMARY KEY ([id], [tripid]),
		CONSTRAINT fk4 FOREIGN KEY ([from]) REFERENCES Airports_Final_CS([id]),
		CONSTRAINT fk5 FOREIGN KEY ([to]) REFERENCES Airports_Final_CS([id]),
		CONSTRAINT fk6 FOREIGN KEY ([tripid]) REFERENCES MyFlights_Final_CS([id]),
		CONSTRAINT fk7 FOREIGN KEY ([airlinecode]) REFERENCES Airlines_Final_CS([id])
)


select * from Airports_Final_CS
select * from Airlines_Final_CS
select * from MyFlights_Final_CS
select * from Legs_Final_CS


drop table [Airports_Final_CS]
drop table [Airlines_Final_CS]
drop table [MyFlights_Final_CS]
drop table [Legs_Final_CS]


DELETE FROM Airports_Final_CS
DELETE FROM Airlines_Final_CS
DELETE FROM MyFlights_Final_CS
DELETE FROM Legs_Final_CS


INSERT INTO Airlines_Final_CS ([id], [name]) 
Values(N'V7', N'Volotea')


INSERT INTO MyFlights_Final_CS ([id], [from], [to], departuretime, arrivaltime, flyduration, price, numstops) 
Values(N'08a513a247eb00000e32q8bb_0', N'TLV', N'JFK', N'3223232', N'ZxEINZXz', N'sdcsd2', N'623.34', N'3')


INSERT INTO Legs_Final_CS (id, tripid, legnum, flightno, [from], [to], airlinecode, departuretime, arrivaltime, flyduration) 
Values(N'sasdsdz', N'08a513a247eb00000e3248bb_0|08a513a247eb00000e3248bb_1|13a20bce47ec00001ef7167f_0|0bce259a47ed0000f9b7563d_0', N'3', N'sa4k', N'AAL', N'LCG', N'H3', N'SK$K', N'S333K', N'14h 5m')