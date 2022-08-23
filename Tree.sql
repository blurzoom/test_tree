create table Tree
(
    id        int(6) unsigned auto_increment
        primary key,
    name      varchar(30) not null,
    parent_id int(6)      null
);

INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (1, 'base', 0);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (2, 'level 1', 1);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (3, 'level 2', 1);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (4, 'level 3', 1);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (5, 'level 1/1', 2);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (6, 'level 2/1', 3);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (7, 'level 3/1', 4);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (10, 'level 3/1/1', 7);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (11, 'level 3/1/2', 7);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (12, 'level 3/2', 4);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (13, 'level 3/2/1', 12);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (14, 'level 2/2', 3);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (15, 'level 2/3', 3);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (18, 'level 3/2/1', 12);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (19, 'level 3/2/2/1', 18);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (22, 'level 2/1', 2);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (23, 'level 2/2/1', 22);
INSERT INTO DB_test.Tree (id, name, parent_id) VALUES (24, 'level 2/2/1', 14);
