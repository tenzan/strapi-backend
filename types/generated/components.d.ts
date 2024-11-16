import type { Schema, Struct } from '@strapi/strapi';

export interface DisplayResolution extends Struct.ComponentSchema {
  collectionName: 'components_display_resolutions';
  info: {
    description: 'Screen resolution specifications';
    displayName: 'Resolution';
  };
  attributes: {
    height: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    scale: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0.1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    width: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface PlaylistPlaylistItem extends Struct.ComponentSchema {
  collectionName: 'components_playlist_playlist_items';
  info: {
    description: 'Individual items in a playlist with their zone assignments';
    displayName: 'Playlist Item';
  };
  attributes: {
    content: Schema.Attribute.Relation<
      'oneToOne',
      'api::media-content.media-content'
    >;
    duration: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    transition: Schema.Attribute.Enumeration<
      ['default', 'none', 'fade', 'slide', 'zoom']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    zoneId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ScheduleSchedule extends Struct.ComponentSchema {
  collectionName: 'components_schedule_schedules';
  info: {
    description: 'Scheduling configuration for playlists';
    displayName: 'Schedule';
  };
  attributes: {
    daysOfWeek: Schema.Attribute.JSON;
    endDate: Schema.Attribute.DateTime;
    endTime: Schema.Attribute.Time;
    frequency: Schema.Attribute.Enumeration<
      ['daily', 'weekly', 'monthly', 'custom']
    >;
    isRecurring: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    startDate: Schema.Attribute.DateTime;
    startTime: Schema.Attribute.Time;
    timezone: Schema.Attribute.String & Schema.Attribute.DefaultTo<'UTC'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'display.resolution': DisplayResolution;
      'playlist.playlist-item': PlaylistPlaylistItem;
      'schedule.schedule': ScheduleSchedule;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
