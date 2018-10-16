<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'dbjhalmuri');

/** MySQL database username */
define('DB_USER', 'jmadmin');

/** MySQL database password */
define('DB_PASSWORD', '222222');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'F3P87P4/[umMA.{N9OrUrF9x#2k_!$pl%V=Br>>PCi=)iu*qUYJ%[B[xX+Tl6z8b');
define('SECURE_AUTH_KEY',  'B7szD*9?,Xq5M19!N|uw(2Qv@Y,a~|D#,IJvY*.RBq1aS#>I.?&|F$<->=*z7dlU');
define('LOGGED_IN_KEY',    '}7^jJV^S{Bqlu_i7vs(D4#0i%yihC0e 5 Qd:mzM9N2Td|%y7D_cai31[S5nP4Jl');
define('NONCE_KEY',        '?CRd!c;j~nViq/hSxR=0GV_9%1Y_z!m:RNlGkZ[/{Wwp|virzn~hYR.<dA2v&S+t');
define('AUTH_SALT',        'f&)R{p`^0]ITwl%|QEDNes(v&PX4!G7ttls^{Ha|U}r#g1,X[r.N&DUzR/$qra)@');
define('SECURE_AUTH_SALT', 'mchdU.MaqV43Ynhb>D%WQ]f(tc#Z!d?Tc-Ft1#%!yN?T84O <tgwpipVI>9HOaU ');
define('LOGGED_IN_SALT',   '6f5ns2&g>5,?RVsB^aYWa91$+]s2XVX&Lg(RaKS=Af z/s=dpVFEF-&h$}<ByAJm');
define('NONCE_SALT',       'o:Z9H~|M#+&)[}9v3juNNkK+0/K%JA4tl{UO)tSQcmk_dpm.Cn}oj9a<%^lZ>B#C');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
