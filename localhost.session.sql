-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 06-Out-2020 às 03:31
-- Versão do servidor: 10.4.10-MariaDB
-- versão do PHP: 7.1.33

SET SQL_MODE
= "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT
= 0;
START TRANSACTION;
SET time_zone
= "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sc`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_acesso_login`
--

DROP TABLE IF EXISTS `tb_acesso_login`;
CREATE TABLE
IF NOT EXISTS `tb_acesso_login`
(
  `id_login` int
(11) NOT NULL AUTO_INCREMENT,
  `usuario_login` varchar
(150) CHARACTER
SET latin1
NOT NULL,
  `data_login` datetime NOT NULL DEFAULT current_timestamp
(),
  PRIMARY KEY
(`id_login`),
  KEY `usuario_login`
(`usuario_login`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_dados_login`
--

DROP TABLE IF EXISTS `tb_dados_login`;
CREATE TABLE
IF NOT EXISTS `tb_dados_login`
(
  `id_usuario` int
(11) NOT NULL AUTO_INCREMENT,
  `usuario_login` varchar
(150) CHARACTER
SET latin1
NOT NULL,
  `usuario_senha` varchar
(42) CHARACTER
SET latin1
NOT NULL,
  PRIMARY KEY
(`id_usuario`),
  KEY `usuario_login`
(`usuario_login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_redes_sociais`
--

DROP TABLE IF EXISTS `tb_redes_sociais`;
CREATE TABLE
IF NOT EXISTS `tb_redes_sociais`
(
  `id_usuario` int
(11) NOT NULL,
  `linkedin_usuario` varchar
(250) CHARACTER
SET latin1 DEFAULT
NULL,
  `github_usuario` varchar
(250) CHARACTER
SET latin1 DEFAULT
NULL,
  `email_usuario` varchar
(250) CHARACTER
SET latin1 DEFAULT
NULL,
  KEY `id_usuario`
(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_setor`
--

DROP TABLE IF EXISTS `tb_setor`;
CREATE TABLE
IF NOT EXISTS `tb_setor`
(
  `id_setor` int
(11) NOT NULL AUTO_INCREMENT,
  `nome_setor` varchar
(150) CHARACTER
SET latin1
NOT NULL,
  PRIMARY KEY
(`id_setor`),
  KEY `nome_setor`
(`nome_setor`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `tb_setor`
--

INSERT INTO `tb_setor` (`
id_setor`,
`nome_setor
`) VALUES
(2, 'Coordenação'),
(1, 'Direção'),
(3, 'Técnico');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_sexo`
--

DROP TABLE IF EXISTS `tb_sexo`;
CREATE TABLE
IF NOT EXISTS `tb_sexo`
(
  `id_sexo` int
(11) NOT NULL AUTO_INCREMENT,
  `nome_sexo` varchar
(50) CHARACTER
SET latin1
NOT NULL,
  PRIMARY KEY
(`id_sexo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `tb_sexo`
--

INSERT INTO `tb_sexo` (`
id_sexo`,
`nome_sexo
`) VALUES
(1, 'Não informar'),
(2, 'Masculino'),
(3, 'Feminino');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_status`
--

DROP TABLE IF EXISTS `tb_status`;
CREATE TABLE
IF NOT EXISTS `tb_status`
(
  `id_status` int
(11) NOT NULL AUTO_INCREMENT,
  `nome_status` varchar
(150) CHARACTER
SET latin1
NOT NULL,
  PRIMARY KEY
(`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `tb_status`
--

INSERT INTO `tb_status` (`
id_status`,
`nome_status
`) VALUES
(1, 'Não ativo'),
(2, 'Ativo');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_usuario`
--

DROP TABLE IF EXISTS `tb_usuario`;
CREATE TABLE
IF NOT EXISTS `tb_usuario`
(
  `id_usuario` int
(11) NOT NULL,
  `cpf_usuario` varchar
(20) CHARACTER
SET latin1
NOT NULL,
  `email_usuario` varchar
(250) CHARACTER
SET latin1
NOT NULL,
  `nome_usuario` varchar
(250) CHARACTER
SET latin1
NOT NULL,
  `tel_usuario` varchar
(20) CHARACTER
SET latin1
NOT NULL,
  `setor_usuario` int
(11) NOT NULL,
  `sexo_usuario` int
(11) NOT NULL,
  `sobre_usuario` varchar
(300) CHARACTER
SET latin1 DEFAULT
NULL,
  `status_usuario` int
(11) NOT NULL DEFAULT 1,
  KEY `setor_usuario`
(`setor_usuario`),
  KEY `status_usuario`
(`status_usuario`),
  KEY `tb_usuario_ibfk_2`
(`sexo_usuario`),
  KEY `tb_usuario_ibfk_4`
(`cpf_usuario`),
  KEY `id_usuario`
(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `tb_acesso_login`
--
ALTER TABLE `tb_acesso_login`
ADD CONSTRAINT `tb_acesso_login_ibfk_1` FOREIGN KEY
(`usuario_login`) REFERENCES `tb_dados_login`
(`usuario_login`) ON
DELETE NO ACTION ON
UPDATE NO ACTION;

--
-- Limitadores para a tabela `tb_redes_sociais`
--
ALTER TABLE `tb_redes_sociais`
ADD CONSTRAINT `tb_redes_sociais_ibfk_1` FOREIGN KEY
(`id_usuario`) REFERENCES `tb_dados_login`
(`id_usuario`) ON
DELETE CASCADE ON
UPDATE CASCADE;

--
-- Limitadores para a tabela `tb_usuario`
--
ALTER TABLE `tb_usuario`
ADD CONSTRAINT `tb_usuario_ibfk_1` FOREIGN KEY
(`id_usuario`) REFERENCES `tb_dados_login`
(`id_usuario`) ON
DELETE CASCADE ON
UPDATE CASCADE,
ADD CONSTRAINT `tb_usuario_ibfk_2` FOREIGN KEY
(`setor_usuario`) REFERENCES `tb_setor`
(`id_setor`) ON
DELETE CASCADE ON
UPDATE CASCADE,
ADD CONSTRAINT `tb_usuario_ibfk_3` FOREIGN KEY
(`sexo_usuario`) REFERENCES `tb_sexo`
(`id_sexo`) ON
DELETE CASCADE ON
UPDATE CASCADE,
ADD CONSTRAINT `tb_usuario_ibfk_4` FOREIGN KEY
(`status_usuario`) REFERENCES `tb_status`
(`id_status`) ON
DELETE CASCADE ON
UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;