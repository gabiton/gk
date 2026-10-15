import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type HomepageDocumentDataSlicesSlice = HomeHeroSlice | HomeFormSlice | EnTodosLadosSlice | LoQueCreoSlice | SobreMiSlice

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

export type AllDocumentTypes = HomepageDocument;

/**
 * Item in *EnTodosLados → Default → Primary → Videos*
 */
export interface EnTodosLadosSliceDefaultPrimaryVideosItem {
	/**
	 * Imagen field in *EnTodosLados → Default → Primary → Videos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * URL del video field in *EnTodosLados → Default → Primary → Videos*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[].video_url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	video_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Título field in *EnTodosLados → Default → Primary → Videos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Fecha field in *EnTodosLados → Default → Primary → Videos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[].date
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	date: prismic.KeyTextField;
	
	/**
	 * Logo del canal field in *EnTodosLados → Default → Primary → Videos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[].channel_logo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	channel_logo: prismic.ImageField<never>;
}

/**
 * Primary content in *EnTodosLados → Default → Primary*
 */
export interface EnTodosLadosSliceDefaultPrimary {
	/**
	 * Kilómetros field in *EnTodosLados → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.kilometers
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	kilometers: prismic.NumberField;
	
	/**
	 * Título field in *EnTodosLados → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Videos field in *EnTodosLados → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: en_todos_lados.default.primary.videos[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	videos: prismic.GroupField<Simplify<EnTodosLadosSliceDefaultPrimaryVideosItem>>;
}

/**
 * Default variation for EnTodosLados Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EnTodosLadosSliceDefault = prismic.SharedSliceVariation<"default", Simplify<EnTodosLadosSliceDefaultPrimary>, never>;

/**
 * Slice variation for *EnTodosLados*
 */
type EnTodosLadosSliceVariation = EnTodosLadosSliceDefault

/**
 * EnTodosLados Shared Slice
 *
 * - **API ID**: `en_todos_lados`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EnTodosLadosSlice = prismic.SharedSlice<"en_todos_lados", EnTodosLadosSliceVariation>;

/**
 * Primary content in *HomeForm → Default → Primary*
 */
export interface HomeFormSliceDefaultPrimary {
	/**
	 * Título field in *HomeForm → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_form.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Video de fondo field in *HomeForm → Default → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_form.default.primary.background_video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	background_video: prismic.LinkToMediaField<prismic.FieldState, never>;
}

/**
 * Default variation for HomeForm Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HomeFormSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HomeFormSliceDefaultPrimary>, never>;

/**
 * Slice variation for *HomeForm*
 */
type HomeFormSliceVariation = HomeFormSliceDefault

/**
 * HomeForm Shared Slice
 *
 * - **API ID**: `home_form`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HomeFormSlice = prismic.SharedSlice<"home_form", HomeFormSliceVariation>;

/**
 * Primary content in *HomeHero → Default → Primary*
 */
export interface HomeHeroSliceDefaultPrimary {
	/**
	 * Texto del título field in *HomeHero → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_hero.default.primary.tagline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Imagen de escritorio field in *HomeHero → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_hero.default.primary.desktop_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	desktop_image: prismic.ImageField<never>;
	
	/**
	 * Imagen para móvil field in *HomeHero → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_hero.default.primary.mobile_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	mobile_image: prismic.ImageField<never>;
}

/**
 * Default variation for HomeHero Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HomeHeroSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HomeHeroSliceDefaultPrimary>, never>;

/**
 * Slice variation for *HomeHero*
 */
type HomeHeroSliceVariation = HomeHeroSliceDefault

/**
 * HomeHero Shared Slice
 *
 * - **API ID**: `home_hero`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HomeHeroSlice = prismic.SharedSlice<"home_hero", HomeHeroSliceVariation>;

/**
 * Item in *LoQueCreo → Default → Primary → Items*
 */
export interface LoQueCreoSliceDefaultPrimaryItemsItem {
	/**
	 * Imagen field in *LoQueCreo → Default → Primary → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.items[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Título field in *LoQueCreo → Default → Primary → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Texto field in *LoQueCreo → Default → Primary → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Link field in *LoQueCreo → Default → Primary → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *LoQueCreo → Default → Primary*
 */
export interface LoQueCreoSliceDefaultPrimary {
	/**
	 * Título field in *LoQueCreo → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Link Ver todos field in *LoQueCreo → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.view_all_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	view_all_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Items field in *LoQueCreo → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lo_que_creo.default.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<LoQueCreoSliceDefaultPrimaryItemsItem>>;
}

/**
 * Default variation for LoQueCreo Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type LoQueCreoSliceDefault = prismic.SharedSliceVariation<"default", Simplify<LoQueCreoSliceDefaultPrimary>, never>;

/**
 * Slice variation for *LoQueCreo*
 */
type LoQueCreoSliceVariation = LoQueCreoSliceDefault

/**
 * LoQueCreo Shared Slice
 *
 * - **API ID**: `lo_que_creo`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type LoQueCreoSlice = prismic.SharedSlice<"lo_que_creo", LoQueCreoSliceVariation>;

/**
 * Item in *SobreMi → Default → Primary → Videos*
 */
export interface SobreMiSliceDefaultPrimaryVideosItem {
	/**
	 * URL de YouTube field in *SobreMi → Default → Primary → Videos*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.videos[].youtube_url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	youtube_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Título field in *SobreMi → Default → Primary → Videos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.videos[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
}

/**
 * Primary content in *SobreMi → Default → Primary*
 */
export interface SobreMiSliceDefaultPrimary {
	/**
	 * Título field in *SobreMi → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Imagen field in *SobreMi → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Texto field in *SobreMi → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
	
	/**
	 * Videos field in *SobreMi → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: sobre_mi.default.primary.videos[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	videos: prismic.GroupField<Simplify<SobreMiSliceDefaultPrimaryVideosItem>>;
}

/**
 * Default variation for SobreMi Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SobreMiSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SobreMiSliceDefaultPrimary>, never>;

/**
 * Slice variation for *SobreMi*
 */
type SobreMiSliceVariation = SobreMiSliceDefault

/**
 * SobreMi Shared Slice
 *
 * - **API ID**: `sobre_mi`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SobreMiSlice = prismic.SharedSlice<"sobre_mi", SobreMiSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			AllDocumentTypes,
			EnTodosLadosSlice,
			EnTodosLadosSliceDefaultPrimaryVideosItem,
			EnTodosLadosSliceDefaultPrimary,
			EnTodosLadosSliceVariation,
			EnTodosLadosSliceDefault,
			HomeFormSlice,
			HomeFormSliceDefaultPrimary,
			HomeFormSliceVariation,
			HomeFormSliceDefault,
			HomeHeroSlice,
			HomeHeroSliceDefaultPrimary,
			HomeHeroSliceVariation,
			HomeHeroSliceDefault,
			LoQueCreoSlice,
			LoQueCreoSliceDefaultPrimaryItemsItem,
			LoQueCreoSliceDefaultPrimary,
			LoQueCreoSliceVariation,
			LoQueCreoSliceDefault,
			SobreMiSlice,
			SobreMiSliceDefaultPrimaryVideosItem,
			SobreMiSliceDefaultPrimary,
			SobreMiSliceVariation,
			SobreMiSliceDefault
		}
	}
}