<?php
	
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
	
	//-------------------------------------------------------------------------------
	// Detecting IE 11 Browser
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_ie11' ) ):
		function wvs_is_ie11() {
			global $is_IE;
			
			if ( ! isset( $_SERVER[ 'HTTP_USER_AGENT' ] ) ) {
				return false;
			}
			
			$ua   = $_SERVER[ 'HTTP_USER_AGENT' ];
			$is11 = preg_match( "/Trident\/7.0;(.*)rv:11.0/", $ua, $match ) !== false;
			
			return $is_IE && $is11;
			//return TRUE;
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Get All Image Sizes
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_get_all_image_sizes' ) ):
		function wvs_get_all_image_sizes() {
			return apply_filters( 'wvs_get_all_image_sizes', array_reduce( get_intermediate_image_sizes(), function ( $carry, $item ) {
				$carry[ $item ] = ucwords( str_ireplace( array( '-', '_' ), ' ', $item ) );
				
				return $carry;
			}, array() ) );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Available Product Attribute Types
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_available_attributes_types' ) ):
		function wvs_available_attributes_types( $type = false ) {
			$types = array();
			
			$types[ 'color' ] = array(
				'title'   => esc_html__( 'Color', 'woo-variation-swatches' ),
				'output'  => 'wvs_color_variation_attribute_options',
				'preview' => 'wvs_color_variation_attribute_preview'
			);
			
			$types[ 'image' ] = array(
				'title'   => esc_html__( 'Image', 'woo-variation-swatches' ),
				'output'  => 'wvs_image_variation_attribute_options',
				'preview' => 'wvs_image_variation_attribute_preview'
			);
			
			$types[ 'button' ] = array(
				'title'   => esc_html__( 'Button', 'woo-variation-swatches' ),
				'output'  => 'wvs_button_variation_attribute_options',
				'preview' => 'wvs_button_variation_attribute_preview'
			);
			
			$types = apply_filters( 'wvs_available_attributes_types', $types );
			
			if ( $type ) {
				return isset( $types[ $type ] ) ? $types[ $type ] : array();
			}
			
			return $types;
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Color Variation Preview
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_color_variation_attribute_preview' ) ):
		function wvs_color_variation_attribute_preview( $term_id, $attribute, $fields ) {
			
			$key   = $fields[ 0 ][ 'id' ];
			$value = sanitize_hex_color( get_term_meta( $term_id, $key, true ) );
			
			printf( '<div class="wvs-preview wvs-color-preview" style="background-color:%s;"></div>', esc_attr( $value ) );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Image Variation Preview
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_image_variation_attribute_preview' ) ):
		function wvs_image_variation_attribute_preview( $term_id, $attribute, $fields ) {
			
			$key           = $fields[ 0 ][ 'id' ];
			$attachment_id = absint( get_term_meta( $term_id, $key, true ) );
			$image         = wp_get_attachment_image_url( $attachment_id );
			
			printf( '<img src="%s" class="wvs-preview wvs-image-preview" />', esc_url( $image ) );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Add attribute types on WooCommerce taxonomy
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_product_attributes_types' ) ):
		function wvs_product_attributes_types( $selector ) {
			
			foreach ( wvs_available_attributes_types() as $key => $options ) {
				$selector[ $key ] = $options[ 'title' ];
			}
			
			return $selector;
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Tutorials Tab Contents
	//-------------------------------------------------------------------------------
	if ( ! function_exists( 'wvs_tutorial_tab_contents' ) ):
		function wvs_tutorial_tab_contents() {
			ob_start();
			include_once woo_variation_swatches()->include_path( 'tutorials.php' );
			
			return ob_get_clean();
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Enable Ajax Variation
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_ajax_variation_threshold' ) ):
		function wvs_ajax_variation_threshold() {
			return absint( woo_variation_swatches()->get_option( 'threshold' ) );
		}
	endif;
	
	
	function wvs_get_available_product_variations() {
		if ( is_ajax() && isset( $_GET[ 'product_id' ] ) ) {
			$product_id           = absint( $_GET[ 'product_id' ] );
			$product              = wc_get_product( $product_id );
			$available_variations = array_values( $product->get_available_variations() );
			
			wp_send_json_success( wp_json_encode( $available_variations ) );
		} else {
			wp_send_json_error();
		}
	}
	
	
	// Tutorials TAB
	
	add_action( 'after_wvs_settings', function ( $swatches ) {
		$swatches->add_setting( 'tutorial', esc_html__( 'Tutorials', 'woo-variation-swatches' ), array(
			array(
				'pro'    => true,
				'title'  => esc_html__( 'How to tutorials', 'woo-variation-swatches-pro' ),
				'desc'   => esc_html__( 'How to setup and use this plugin', 'woo-variation-swatches' ),
				'fields' => apply_filters( 'wvs_pro_large_catalog_setting_fields', array(
					array(
						'pro'  => true,
						'html' => wvs_tutorial_tab_contents(),
					),
				) )
			)
		), apply_filters( 'wvs_tutorial_setting_default_active', false ) );
	}, 50 );
	
	//-------------------------------------------------------------------------------
	// Add settings
	// Add Theme Support:
	// add_theme_support( 'woo-variation-swatches', array( 'tooltip' => FALSE, 'stylesheet' => FALSE, 'style'=>'rounded' ) );
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_settings' ) ):
		function wvs_settings() {
			
			do_action( 'before_wvs_settings', woo_variation_swatches() );
			
			woo_variation_swatches()->add_setting( 'simple', esc_html__( 'Simple', 'woo-variation-swatches' ), apply_filters( 'wvs_simple_settings_section', array(
				array(
					'title'  => esc_html__( 'Visual Section', 'woo-variation-swatches' ),
					'desc'   => esc_html__( 'Simple change some visual styles', 'woo-variation-swatches' ),
					'fields' => apply_filters( 'wvs_simple_setting_fields', array(
						array(
							'id'      => 'tooltip',
							'type'    => 'checkbox',
							'title'   => esc_html__( 'Enable Tooltip', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Enable / Disable plugin default tooltip on each product attribute.', 'woo-variation-swatches' ),
							'default' => true
						),
						array(
							'id'      => 'stylesheet',
							'type'    => 'checkbox',
							'title'   => esc_html__( 'Enable Stylesheet', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Enable / Disable plugin default stylesheet', 'woo-variation-swatches' ),
							'default' => true
						),
						array(
							'id'      => 'style',
							'type'    => 'radio',
							'title'   => esc_html__( 'Shape style', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Attribute Shape Style', 'woo-variation-swatches' ),
							'options' => array(
								'rounded' => esc_html__( 'Rounded Shape', 'woo-variation-swatches' ),
								'squared' => esc_html__( 'Squared Shape', 'woo-variation-swatches' )
							),
							'default' => 'rounded'
						)
					) )
				)
			) ), apply_filters( 'wvs_simple_setting_default_active', true ) );
			
			woo_variation_swatches()->add_setting( 'advanced', esc_html__( 'Advanced', 'woo-variation-swatches' ), apply_filters( 'wvs_advanced_settings_section', array(
				array(
					'title'  => esc_html__( 'Visual Section', 'woo-variation-swatches' ),
					'desc'   => esc_html__( 'Advanced change some visual styles', 'woo-variation-swatches' ),
					'fields' => apply_filters( 'wvs_advanced_setting_fields', array(
						array(
							'id'      => 'clear_on_reselect',
							'type'    => 'checkbox',
							'title'   => esc_html__( 'Clear on Reselect', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Clear selected attribute on select again', 'woo-variation-swatches' ),
							'default' => false
						),
						array(
							'id'      => 'threshold',
							'type'    => 'number',
							'title'   => esc_html__( 'Ajax variation threshold', 'woo-variation-swatches' ),
							'desc'    => __( 'Control the number of enable ajax variation threshold, If you set <code>1</code> all product variation will be load via ajax. Default value is <code>30</code>, <br><span style="color: red">Note: Product variation loaded via ajax doesn\'t follow attribute behaviour. It\'s recommended to keep this number between 30 - 40.</span>', 'woo-variation-swatches' ),
							'default' => 30,
							'min'     => 1,
							'max'     => 80,
						),
						array(
							'id'      => 'attribute-behavior',
							'type'    => 'radio',
							'title'   => esc_html__( 'Attribute behavior', 'woo-variation-swatches' ),
							'desc'    => __( 'Disabled attribute will be hide / blur. <br><span style="color: red">Note: Product variation loaded via ajax doesn\'t apply this feature.</span>', 'woo-variation-swatches' ),
							'options' => array(
								'blur'          => esc_html__( 'Blur with cross', 'woo-variation-swatches' ),
								'blur-no-cross' => esc_html__( 'Blur without cross', 'woo-variation-swatches' ),
								'hide'          => esc_html__( 'Hide', 'woo-variation-swatches' ),
							),
							'default' => 'blur'
						),
						array(
							'id'      => 'attribute_image_size',
							'type'    => 'select',
							'title'   => esc_html__( 'Attribute image size', 'woo-variation-swatches' ),
							'desc'    => has_filter( 'wvs_product_attribute_image_size' ) ? __( '<span style="color: red">Attribute image size changed by <code>wvs_product_attribute_image_size</code> hook. So this option will not apply any effect.</span>', 'woo-variation-swatches' ) : __( sprintf( 'Choose attribute image size. <a target="_blank" href="%s">Media Settings</a>', esc_url( admin_url( 'options-media.php' ) ) ), 'woo-variation-swatches' ),
							'options' => wvs_get_all_image_sizes(),
							'default' => 'thumbnail'
						),
						array(
							'id'      => 'width',
							'type'    => 'number',
							'title'   => esc_html__( 'Width', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Variation item width', 'woo-variation-swatches' ),
							'default' => 30,
							'min'     => 10,
							'max'     => 200,
							'suffix'  => 'px'
						),
						array(
							'id'      => 'height',
							'type'    => 'number',
							'title'   => esc_html__( 'Height', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Variation item height', 'woo-variation-swatches' ),
							'default' => 30,
							'min'     => 10,
							'max'     => 200,
							'suffix'  => 'px'
						),
						array(
							'id'      => 'single-font-size',
							'type'    => 'number',
							'title'   => esc_html__( 'Font Size', 'woo-variation-swatches' ),
							'desc'    => esc_html__( 'Single product variation item font size', 'woo-variation-swatches' ),
							'default' => 16,
							'min'     => 8,
							'max'     => 24,
							'suffix'  => 'px'
						)
					) )
				)
			) ), apply_filters( 'wvs_advanced_setting_default_active', false ) );
			
			if ( ! woo_variation_swatches()->is_pro_active() ) {
				woo_variation_swatches()->add_setting( 'style', esc_html__( 'Style', 'woo-variation-swatches' ), array(
					array(
						'pro'    => true,
						'title'  => esc_html__( 'Visual Styling', 'woo-variation-swatches-pro' ),
						'desc'   => esc_html__( 'Change some visual styles', 'woo-variation-swatches' ),
						'fields' => apply_filters( 'wvs_pro_style_setting_fields', array(
							array(
								'pro'          => true,
								'width'        => '100%',
								'screen_shot'  => woo_variation_swatches()->images_uri( 'style-preview.png' ),
								'product_link' => woo_variation_swatches()->get_pro_link( 'style-tab' ),
							),
						) )
					)
				), apply_filters( 'wvs_pro_style_setting_default_active', false ), true );
			}
			
			if ( ! woo_variation_swatches()->is_pro_active() ) {
				woo_variation_swatches()->add_setting( 'archive', esc_html__( 'Archive / Shop', 'woo-variation-swatches' ), array(
					array(
						'pro'    => true,
						'title'  => esc_html__( 'Visual Section', 'woo-variation-swatches-pro' ),
						'desc'   => esc_html__( 'Advanced change some visual styles on shop / archive page', 'woo-variation-swatches' ),
						'fields' => apply_filters( 'wvs_pro_archive_setting_fields', array(
							array(
								'pro'          => true,
								'width'        => '100%',
								'screen_shot'  => woo_variation_swatches()->images_uri( 'archive-preview.png' ),
								'product_link' => woo_variation_swatches()->get_pro_link( 'archive-tab' ),
							),
						) )
					)
				), apply_filters( 'wvs_pro_archive_setting_default_active', false ), true );
			}
			
			if ( ! woo_variation_swatches()->is_pro_active() ) {
				woo_variation_swatches()->add_setting( 'special', esc_html__( 'Special Attribute', 'woo-variation-swatches' ), array(
					array(
						'pro'    => true,
						'title'  => esc_html__( 'Catalog mode', 'woo-variation-swatches-pro' ),
						'desc'   => esc_html__( 'Show single attribute as catalog mode on shop / archive pages', 'woo-variation-swatches' ),
						'fields' => apply_filters( 'wvs_pro_large_catalog_setting_fields', array(
							array(
								'pro'          => true,
								'width'        => '100%',
								'screen_shot'  => woo_variation_swatches()->images_uri( 'special-preview.png' ),
								'product_link' => woo_variation_swatches()->get_pro_link( 'special-tab' ),
							),
						) )
					)
				), apply_filters( 'wvs_pro_special_setting_default_active', false ), true );
			}
			
			do_action( 'after_wvs_settings', woo_variation_swatches() );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// WooCommerce taxonomy Meta Field Settings
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_taxonomy_meta_fields' ) ):
		function wvs_taxonomy_meta_fields( $field_id = false ) {
			
			$fields = array();
			
			$fields[ 'color' ] = array(
				array(
					'label' => esc_html__( 'Color', 'woo-variation-swatches' ), // <label>
					'desc'  => esc_html__( 'Choose a color', 'woo-variation-swatches' ), // description
					'id'    => 'product_attribute_color', // name of field
					'type'  => 'color'
				)
			);
			
			$fields[ 'image' ] = array(
				array(
					'label' => esc_html__( 'Image', 'woo-variation-swatches' ), // <label>
					'desc'  => esc_html__( 'Choose an Image', 'woo-variation-swatches' ), // description
					'id'    => 'product_attribute_image', // name of field
					'type'  => 'image'
				)
			);
			
			$fields = apply_filters( 'wvs_product_taxonomy_meta_fields', $fields );
			
			if ( $field_id ) {
				return isset( $fields[ $field_id ] ) ? $fields[ $field_id ] : array();
			}
			
			return $fields;
			
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Is Color Attribute
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_color_attribute' ) ):
		function wvs_is_color_attribute( $attribute ) {
			if ( ! is_object( $attribute ) ) {
				return false;
			}
			
			return $attribute->attribute_type == 'color';
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Is Image Attribute
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_image_attribute' ) ):
		function wvs_is_image_attribute( $attribute ) {
			if ( ! is_object( $attribute ) ) {
				return false;
			}
			
			return $attribute->attribute_type == 'image';
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Is Button Attribute
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_button_attribute' ) ):
		function wvs_is_button_attribute( $attribute ) {
			if ( ! is_object( $attribute ) ) {
				return false;
			}
			
			return $attribute->attribute_type == 'button';
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Is Radio Attribute
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_radio_attribute' ) ):
		function wvs_is_radio_attribute( $attribute ) {
			if ( ! is_object( $attribute ) ) {
				return false;
			}
			
			return $attribute->attribute_type == 'radio';
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Is Select Attribute
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_is_select_attribute' ) ):
		function wvs_is_select_attribute( $attribute ) {
			if ( ! is_object( $attribute ) ) {
				return false;
			}
			
			return $attribute->attribute_type == 'select';
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Get Color Attribute Value
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_get_product_attribute_color' ) ):
		function wvs_get_product_attribute_color( $term ) {
			if ( ! is_object( $term ) ) {
				return false;
			}
			
			return get_term_meta( $term->term_id, 'product_attribute_color', true );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Get Image Attribute Value
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_get_product_attribute_image' ) ):
		function wvs_get_product_attribute_image( $term ) {
			if ( ! is_object( $term ) ) {
				return false;
			}
			
			return get_term_meta( $term->term_id, 'product_attribute_image', true );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Add WooCommerce taxonomy Meta
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_add_product_taxonomy_meta' ) ) {
		function wvs_add_product_taxonomy_meta() {
			
			$fields         = wvs_taxonomy_meta_fields();
			$meta_added_for = apply_filters( 'wvs_product_taxonomy_meta_for', array_keys( $fields ) );
			
			if ( function_exists( 'wc_get_attribute_taxonomies' ) ):
				
				$attribute_taxonomies = wc_get_attribute_taxonomies();
				if ( $attribute_taxonomies ) :
					foreach ( $attribute_taxonomies as $tax ) :
						$product_attr      = wc_attribute_taxonomy_name( $tax->attribute_name );
						$product_attr_type = $tax->attribute_type;
						if ( in_array( $product_attr_type, $meta_added_for ) ) :
							woo_variation_swatches()->add_term_meta( $product_attr, 'product', $fields[ $product_attr_type ] );
							
							do_action( 'wvs_wc_attribute_taxonomy_meta_added', $product_attr, $product_attr_type );
						endif; //  in_array( $product_attr_type, array( 'color', 'image' ) )
					endforeach; // $attribute_taxonomies
				endif; // $attribute_taxonomies
			endif; // function_exists( 'wc_get_attribute_taxonomies' )
		}
	}
	
	//-------------------------------------------------------------------------------
	// Extra Product Option Terms
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_product_option_terms' ) ) :
		function wvs_product_option_terms( $attribute_taxonomy, $i ) {
			// $attribute_taxonomy, $i
			// $tax, $i
			global $thepostid;
			if ( in_array( $attribute_taxonomy->attribute_type, array_keys( wvs_available_attributes_types() ) ) ) {
				
				$taxonomy = wc_attribute_taxonomy_name( $attribute_taxonomy->attribute_name );
				
				$args = array(
					'orderby'    => 'name',
					'hide_empty' => 0,
				);
				?>
                <select multiple="multiple" data-placeholder="<?php esc_attr_e( 'Select terms', 'woo-variation-swatches' ); ?>" class="multiselect attribute_values wc-enhanced-select" name="attribute_values[<?php echo $i; ?>][]">
					<?php
						$all_terms = get_terms( $taxonomy, apply_filters( 'woocommerce_product_attribute_terms', $args ) );
						if ( $all_terms ) :
							foreach ( $all_terms as $term ) :
								echo '<option value="' . esc_attr( $term->term_id ) . '" ' . selected( has_term( absint( $term->term_id ), $taxonomy, $thepostid ), true, false ) . '>' . esc_attr( apply_filters( 'woocommerce_product_attribute_term_name', $term->name, $term ) ) . '</option>';
							endforeach;
						endif;
					?>
                </select>
				<?php do_action( 'before_wvs_product_option_terms_button', $attribute_taxonomy, $taxonomy ); ?>
                <button class="button plus select_all_attributes"><?php esc_html_e( 'Select all', 'woo-variation-swatches' ); ?></button>
                <button class="button minus select_no_attributes"><?php esc_html_e( 'Select none', 'woo-variation-swatches' ); ?></button>
				
				<?php
				$fields = wvs_taxonomy_meta_fields( $attribute_taxonomy->attribute_type );
				
				if ( ! empty( $fields ) ): ?>
                    <button class="button fr plus wvs_add_new_attribute" data-dialog_title="<?php printf( esc_html__( 'Add new %s', 'woo-variation-swatches' ), esc_attr( $attribute_taxonomy->attribute_label ) ) ?>"><?php esc_html_e( 'Add new', 'woo-variation-swatches' ); ?></button>
				<?php else: ?>
                    <button class="button fr plus add_new_attribute"><?php esc_html_e( 'Add new', 'woo-variation-swatches' ); ?></button>
				<?php endif; ?>
				<?php
				do_action( 'after_wvs_product_option_terms_button', $attribute_taxonomy, $taxonomy );
			}
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Get a Attribute taxonomy values
	//-------------------------------------------------------------------------------
	
	// @TODO: See wc_attribute_taxonomy_id_by_name function and wc_get_attribute
	
	if ( ! function_exists( 'wvs_get_wc_attribute_taxonomy' ) ):
		function wvs_get_wc_attribute_taxonomy( $attribute_name ) {
			
			$transient = sprintf( 'wvs_get_wc_attribute_taxonomy_%s', $attribute_name );
			
			if ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) || isset( $_GET[ 'wvs_clear_transient' ] ) ) {
				delete_transient( $transient );
			}
			
			if ( false === ( $attribute_taxonomy = get_transient( $transient ) ) ) {
				global $wpdb;
				
				$attribute_name     = str_replace( 'pa_', '', wc_sanitize_taxonomy_name( $attribute_name ) );
				$attribute_taxonomy = $wpdb->get_row( "SELECT * FROM " . $wpdb->prefix . "woocommerce_attribute_taxonomies WHERE attribute_name='{$attribute_name}'" );
				set_transient( $transient, $attribute_taxonomy );
			}
			
			return apply_filters( 'wvs_get_wc_attribute_taxonomy', $attribute_taxonomy, $attribute_name );
		}
	endif;
	
	// Clean transient
	add_action( 'woocommerce_attribute_updated', function ( $attribute_id, $attribute, $old_attribute_name ) {
		$transient     = sprintf( 'wvs_get_wc_attribute_taxonomy_%s', wc_attribute_taxonomy_name( $attribute[ 'attribute_name' ] ) );
		$old_transient = sprintf( 'wvs_get_wc_attribute_taxonomy_%s', wc_attribute_taxonomy_name( $old_attribute_name ) );
		delete_transient( $transient );
		delete_transient( $old_transient );
	}, 20, 3 );
	
	// Clean transient
	add_action( 'woocommerce_attribute_deleted', function ( $attribute_id, $attribute_name, $taxonomy ) {
		$transient = sprintf( 'wvs_get_wc_attribute_taxonomy_%s', $taxonomy );
		delete_transient( $transient );
	}, 20, 3 );
	
	//-------------------------------------------------------------------------------
	// Check has attribute type like color or image etc.
	//-------------------------------------------------------------------------------
	if ( ! function_exists( 'wvs_wc_product_has_attribute_type' ) ):
		function wvs_wc_product_has_attribute_type( $type, $attribute_name ) {
			$attribute = wvs_get_wc_attribute_taxonomy( $attribute_name );
			
			return apply_filters( 'wvs_wc_product_has_attribute_type', ( isset( $attribute->attribute_type ) && ( $attribute->attribute_type == $type ) ), $type, $attribute_name, $attribute );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Variation attribute options wrapper
	//-------------------------------------------------------------------------------
	if ( ! function_exists( 'wvs_variable_items_wrapper' ) ):
		function wvs_variable_items_wrapper( $contents, $type, $args, $saved_attribute = array() ) {
			
			$attribute = $args[ 'attribute' ];
			
			$css_classes = apply_filters( 'wvs_variable_items_wrapper_class', array( "{$type}-variable-wrapper" ), $type, $args, $saved_attribute );
			
			$clear_on_reselect = woo_variation_swatches()->get_option( 'clear_on_reselect' ) ? 'reselect-clear' : '';
			
			array_push( $css_classes, $clear_on_reselect );
			
			$data = sprintf( '<ul class="variable-items-wrapper %s" data-attribute_name="%s">%s</ul>', trim( implode( ' ', array_unique( $css_classes ) ) ), esc_attr( wc_variation_attribute_name( $attribute ) ), $contents );
			
			return apply_filters( 'wvs_variable_items_wrapper', $data, $contents, $type, $args, $saved_attribute );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Variation variable item
	//-------------------------------------------------------------------------------
	if ( ! function_exists( 'wvs_variable_item' ) ):
		function wvs_variable_item( $type, $options, $args, $saved_attribute = array() ) {
			
			$product   = $args[ 'product' ];
			$attribute = $args[ 'attribute' ];
			$data      = '';
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					$name  = uniqid( wc_variation_attribute_name( $attribute ) );
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							$selected_class = ( sanitize_title( $args[ 'selected' ] ) == $term->slug ) ? 'selected' : '';
							$tooltip        = trim( apply_filters( 'wvs_variable_item_tooltip', $term->name, $term, $args ) );
							
							$tooltip_html_attr = ! empty( $tooltip ) ? sprintf( 'data-wvstooltip="%s"', esc_attr( $tooltip ) ) : '';
							
							if ( wp_is_mobile() ) {
								$tooltip_html_attr .= ! empty( $tooltip ) ? ' tabindex="2"' : '';
							}
							
							$data .= sprintf( '<li %1$s class="variable-item %2$s-variable-item %2$s-variable-item-%3$s %4$s" title="%5$s" data-value="%3$s">', $tooltip_html_attr, esc_attr( $type ), esc_attr( $term->slug ), esc_attr( $selected_class ), esc_html( $term->name ) );
							
							switch ( $type ):
								case 'color':
									$color = sanitize_hex_color( get_term_meta( $term->term_id, 'product_attribute_color', true ) );
									$data  .= sprintf( '<span class="variable-item-span variable-item-span-%s" style="background-color:%s;"></span>', esc_attr( $type ), esc_attr( $color ) );
									break;
								
								case 'image':
									$attachment_id = absint( get_term_meta( $term->term_id, 'product_attribute_image', true ) );
									$image_size    = woo_variation_swatches()->get_option( 'attribute_image_size' );
									$image_url     = wp_get_attachment_image_url( $attachment_id, apply_filters( 'wvs_product_attribute_image_size', $image_size ) );
									$data          .= sprintf( '<img alt="%s" src="%s" />', esc_attr( $term->name ), esc_url( $image_url ) );
									break;
								
								case 'button':
									$data .= sprintf( '<span class="variable-item-span variable-item-span-%s">%s</span>', esc_attr( $type ), esc_html( $term->name ) );
									break;
								
								case 'radio':
									$id   = uniqid( $term->slug );
									$data .= sprintf( '<input name="%1$s" id="%2$s" class="wvs-radio-variable-item" %3$s  type="radio" value="%4$s" data-value="%4$s" /><label for="%2$s">%5$s</label>', $name, $id, checked( sanitize_title( $args[ 'selected' ] ), $term->slug, false ), esc_attr( $term->slug ), esc_html( $term->name ) );
									break;
								
								default:
									$data .= apply_filters( 'wvs_variable_default_item_content', '', $term, $args, $saved_attribute );
									break;
							endswitch;
							$data .= '</li>';
						}
					}
				}
			}
			
			return apply_filters( 'wvs_variable_item', $data, $type, $options, $args, $saved_attribute );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Color Variation Attribute Options
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_color_variation_attribute_options' ) ) :
		function wvs_color_variation_attribute_options( $args = array() ) {
			
			$args = wp_parse_args( $args, array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'type'             => '',
				'show_option_none' => esc_html__( 'Choose an option', 'woo-variation-swatches' )
			) );
			
			$type                  = $args[ 'type' ];
			$options               = $args[ 'options' ];
			$product               = $args[ 'product' ];
			$attribute             = $args[ 'attribute' ];
			$name                  = $args[ 'name' ] ? $args[ 'name' ] : wc_variation_attribute_name( $attribute );
			$id                    = $args[ 'id' ] ? $args[ 'id' ] : sanitize_title( $attribute );
			$class                 = $args[ 'class' ];
			$show_option_none      = $args[ 'show_option_none' ] ? true : false;
			$show_option_none_text = $args[ 'show_option_none' ] ? $args[ 'show_option_none' ] : esc_html__( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.
			
			if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
				$attributes = $product->get_variation_attributes();
				$options    = $attributes[ $attribute ];
			}
			
			if ( $product && taxonomy_exists( $attribute ) ) {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . ' hide woo-variation-raw-select woo-variation-raw-type-' . esc_attr( $type ) . '" style="display:none" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			} else {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			}
			
			if ( $args[ 'show_option_none' ] ) {
				echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';
			}
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					// Get terms if this is a taxonomy - ordered. We need the names too.
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args[ 'selected' ] ), $term->slug, false ) . '>' . apply_filters( 'woocommerce_variation_option_name', $term->name ) . '</option>';
						}
					}
				} else {
					foreach ( $options as $option ) {
						// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
						$selected = sanitize_title( $args[ 'selected' ] ) === $args[ 'selected' ] ? selected( $args[ 'selected' ], sanitize_title( $option ), false ) : selected( $args[ 'selected' ], $option, false );
						echo '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option ) ) . '</option>';
					}
				}
			}
			
			echo '</select>';
			
			$content = wvs_variable_item( $type, $options, $args );
			
			echo wvs_variable_items_wrapper( $content, $type, $args );
			
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Image Variation Attribute Options
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_image_variation_attribute_options' ) ) :
		function wvs_image_variation_attribute_options( $args = array() ) {
			
			$args = wp_parse_args( $args, array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'type'             => '',
				'show_option_none' => esc_html__( 'Choose an option', 'woo-variation-swatches' )
			) );
			
			$type                  = $args[ 'type' ];
			$options               = $args[ 'options' ];
			$product               = $args[ 'product' ];
			$attribute             = $args[ 'attribute' ];
			$name                  = $args[ 'name' ] ? $args[ 'name' ] : wc_variation_attribute_name( $attribute );
			$id                    = $args[ 'id' ] ? $args[ 'id' ] : sanitize_title( $attribute );
			$class                 = $args[ 'class' ];
			$show_option_none      = $args[ 'show_option_none' ] ? true : false;
			$show_option_none_text = $args[ 'show_option_none' ] ? $args[ 'show_option_none' ] : esc_html__( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.
			
			if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
				$attributes = $product->get_variation_attributes();
				$options    = $attributes[ $attribute ];
			}
			
			
			if ( $product && taxonomy_exists( $attribute ) ) {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . ' hide woo-variation-raw-select woo-variation-raw-type-' . esc_attr( $type ) . '" style="display:none" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			} else {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			}
			
			
			if ( $args[ 'show_option_none' ] ) {
				echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';
			}
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					// Get terms if this is a taxonomy - ordered. We need the names too.
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args[ 'selected' ] ), $term->slug, false ) . '>' . apply_filters( 'woocommerce_variation_option_name', $term->name ) . '</option>';
						}
					}
				} else {
					foreach ( $options as $option ) {
						// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
						$selected = sanitize_title( $args[ 'selected' ] ) === $args[ 'selected' ] ? selected( $args[ 'selected' ], sanitize_title( $option ), false ) : selected( $args[ 'selected' ], $option, false );
						echo '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option ) ) . '</option>';
					}
				}
			}
			
			echo '</select>';
			
			$content = wvs_variable_item( $type, $options, $args );
			
			echo wvs_variable_items_wrapper( $content, $type, $args );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Button Variation Attribute Options
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_button_variation_attribute_options' ) ) :
		function wvs_button_variation_attribute_options( $args = array() ) {
			
			$args = wp_parse_args( $args, array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'type'             => '',
				'show_option_none' => esc_html__( 'Choose an option', 'woo-variation-swatches' )
			) );
			
			$type                  = $args[ 'type' ];
			$options               = $args[ 'options' ];
			$product               = $args[ 'product' ];
			$attribute             = $args[ 'attribute' ];
			$name                  = $args[ 'name' ] ? $args[ 'name' ] : wc_variation_attribute_name( $attribute );
			$id                    = $args[ 'id' ] ? $args[ 'id' ] : sanitize_title( $attribute );
			$class                 = $args[ 'class' ];
			$show_option_none      = $args[ 'show_option_none' ] ? true : false;
			$show_option_none_text = $args[ 'show_option_none' ] ? $args[ 'show_option_none' ] : esc_html__( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.
			
			if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
				$attributes = $product->get_variation_attributes();
				$options    = $attributes[ $attribute ];
			}
			
			if ( $product && taxonomy_exists( $attribute ) ) {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . ' hide woo-variation-raw-select woo-variation-raw-type-' . esc_attr( $type ) . '" style="display:none" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			} else {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			}
			
			if ( $args[ 'show_option_none' ] ) {
				echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';
			}
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					// Get terms if this is a taxonomy - ordered. We need the names too.
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args[ 'selected' ] ), $term->slug, false ) . '>' . apply_filters( 'woocommerce_variation_option_name', $term->name ) . '</option>';
						}
					}
				} else {
					foreach ( $options as $option ) {
						// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
						$selected = sanitize_title( $args[ 'selected' ] ) === $args[ 'selected' ] ? selected( $args[ 'selected' ], sanitize_title( $option ), false ) : selected( $args[ 'selected' ], $option, false );
						echo '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option ) ) . '</option>';
					}
				}
			}
			
			echo '</select>';
			
			$content = wvs_variable_item( $type, $options, $args );
			
			echo wvs_variable_items_wrapper( $content, $type, $args );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Radio Variation Attribute Options
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_radio_variation_attribute_options' ) ) :
		function wvs_radio_variation_attribute_options( $args = array() ) {
			
			$args = wp_parse_args( $args, array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'type'             => '',
				'show_option_none' => esc_html__( 'Choose an option', 'woo-variation-swatches' )
			) );
			
			$type                  = $args[ 'type' ];
			$options               = $args[ 'options' ];
			$product               = $args[ 'product' ];
			$attribute             = $args[ 'attribute' ];
			$name                  = $args[ 'name' ] ? $args[ 'name' ] : wc_variation_attribute_name( $attribute );
			$id                    = $args[ 'id' ] ? $args[ 'id' ] : sanitize_title( $attribute );
			$class                 = $args[ 'class' ];
			$show_option_none      = $args[ 'show_option_none' ] ? true : false;
			$show_option_none_text = $args[ 'show_option_none' ] ? $args[ 'show_option_none' ] : esc_html__( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.
			
			if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
				$attributes = $product->get_variation_attributes();
				$options    = $attributes[ $attribute ];
			}
			
			if ( $product && taxonomy_exists( $attribute ) ) {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . ' hide woo-variation-raw-select woo-variation-raw-type-' . esc_attr( $type ) . '" style="display:none" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			} else {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			}
			
			if ( $args[ 'show_option_none' ] ) {
				echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';
			}
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					// Get terms if this is a taxonomy - ordered. We need the names too.
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args[ 'selected' ] ), $term->slug, false ) . '>' . apply_filters( 'woocommerce_variation_option_name', $term->name ) . '</option>';
						}
					}
				} else {
					foreach ( $options as $option ) {
						// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
						$selected = sanitize_title( $args[ 'selected' ] ) === $args[ 'selected' ] ? selected( $args[ 'selected' ], sanitize_title( $option ), false ) : selected( $args[ 'selected' ], $option, false );
						echo '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option ) ) . '</option>';
					}
				}
			}
			
			echo '</select>';
			
			$content = wvs_variable_item( $type, $options, $args );
			
			echo wvs_variable_items_wrapper( $content, $type, $args );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Generate Option HTML
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_variation_attribute_options_html' ) ):
		function wvs_variation_attribute_options_html( $html, $args ) {
			
			// IE 11 Fallback to default select box
			if ( wvs_is_ie11() ) {
				return $html;
			}
			
			ob_start();
			
			$available_type_keys = array_keys( wvs_available_attributes_types() );
			$available_types     = wvs_available_attributes_types();
			$default             = true;
			
			foreach ( $available_type_keys as $type ) {
				if ( wvs_wc_product_has_attribute_type( $type, $args[ 'attribute' ] ) ) {
					$output_callback = apply_filters( 'wvs_variation_attribute_options_callback', $available_types[ $type ][ 'output' ], $available_types, $type, $args, $html );
					$output_callback( apply_filters( 'wvs_variation_attribute_options_args', wp_parse_args( $args, array(
						'options'    => $args[ 'options' ],
						'attribute'  => $args[ 'attribute' ],
						'product'    => $args[ 'product' ],
						'selected'   => $args[ 'selected' ],
						'type'       => $type,
						'is_archive' => ( isset( $args[ 'is_archive' ] ) && $args[ 'is_archive' ] )
					) ) ) );
					$default = false;
				}
			}
			
			if ( $default ) {
				echo $html;
			}
			
			$data = ob_get_clean();
			
			return apply_filters( 'wvs_variation_attribute_options_html', $data, $args );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Preview TAB
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'add_wvs_pro_preview_tab' ) ):
		function add_wvs_pro_preview_tab( $tabs ) {
			$tabs[ 'woo-variation-swatches-pro' ] = array(
				'label'    => esc_html__( 'Swatches Settings', 'woo-variation-swatches' ),
				'target'   => 'wvs-pro-product-variable-swatches-options',
				'class'    => array( 'show_if_variable', 'variations_tab' ),
				'priority' => 65,
			);
			
			return $tabs;
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// Preview TAB Panel
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'add_wvs_pro_preview_tab_panel' ) ):
		function add_wvs_pro_preview_tab_panel() {
			ob_start();
			?>
            <div id="wvs-pro-product-variable-swatches-options" class="panel wc-metaboxes-wrapper hidden">
                <style type="text/css">
                    .gwp-pro-features-wrapper {
                        padding          : 20px;
                        margin           : 10px;
                        background-color : #f1f1f1;
                        }

                    .gwp-pro-features-wrapper li span {
                        color : #15ce5c;
                        }

                    .gwp-pro-features-wrapper p, .gwp-pro-features-wrapper ul {
                        padding : 10px 0;
                        }

                    .gwp-pro-button span {
                        padding-top : 10px;
                        }
                </style>
                <div class="gwp-pro-features-wrapper">
                    <h3>Upgrade to Woocommerce Variation Swatches - Pro</h3>
                    <p>With the premium version of Woocommerce Variation Swatches, you can do:</p>
                    <ul>
                        <li><span class="dashicons dashicons-yes"></span> Convert attribute variations into radio button.</li>
                        <li><span class="dashicons dashicons-yes"></span> Individual product basis swatches customization.</li>
                        <li><span class="dashicons dashicons-yes"></span> Enable attributes swatch in archives / shop page.</li>
                        <li><span class="dashicons dashicons-yes"></span> Control swatches width and height on archive page.</li>
                        <li><span class="dashicons dashicons-yes"></span> Archive page swatches positioning.</li>
                        <li><span class="dashicons dashicons-yes"></span> Archive page swatches alignment.</li>
                        <li><span class="dashicons dashicons-yes"></span> Hide only out of stock variation product.</li>
                        <li><span class="dashicons dashicons-yes"></span> Individual attribute to show in large style.</li>
                        <li><span class="dashicons dashicons-yes"></span> Catalog mode to show only one attribute on shop / archive page.</li>
                        <li><span class="dashicons dashicons-yes"></span> Tooltip display setting on archive/shop page.</li>
                        <li><span class="dashicons dashicons-yes"></span> Variation clear button display setting.</li>
                        <li><span class="dashicons dashicons-yes"></span> Customize tooltip text and background color.</li>
                        <li><span class="dashicons dashicons-yes"></span> Customize tooltip image and image size.</li>
                        <li><span class="dashicons dashicons-yes"></span> Customize font size, swatches height and width.</li>
                        <li><span class="dashicons dashicons-yes"></span> Customize swatches colors, background and border sizes.</li>
                        <li><span class="dashicons dashicons-yes"></span> Automatic updates and exclusive technical support.</li>
                    </ul>
                    <a target="_blank" class="button button-primary button-hero gwp-pro-button" href="<?php echo esc_url( woo_variation_swatches()->get_pro_link( 'product-edit' ) ); ?>">Okay, I need the features! <span class="dashicons dashicons-external"></span></a>
                </div>
            </div>
			<?php
			
			echo ob_get_clean();
		}
	endif;
	