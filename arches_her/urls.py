from arches.app.views.plugin import PluginView
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from arches_her.views.file_template import FileTemplateView
from arches_her.views.index import IndexView
from django.views.generic import RedirectView
from arches_her.views.resource import ResourceDescriptors
from arches_her.views.active_consultations import ActiveConsultationsView
from arches.app.views import main
from arches.app.views.user import UserManagerView

uuid_regex = settings.UUID_REGEX

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='root'),
    re_path(r'^'+settings.APP_PATHNAME+'/$', IndexView.as_view(), name='consultations-root'),
    re_path(r'^index.htm', IndexView.as_view(), name='home'),
    re_path(r'^'+settings.APP_PATHNAME+'/index.htm', IndexView.as_view(), name='consultations-home'),
    re_path(r'^'+settings.APP_PATHNAME+'/', include('arches.urls')),
    re_path(r'^plugins/active-consultations$', RedirectView.as_view(url='/'+settings.APP_PATHNAME+'/plugins/active-consultations')),
    re_path(r'^resource/descriptors/(?P<resourceid>%s|())$' % uuid_regex, ResourceDescriptors.as_view(), name="resource_descriptors"),
    re_path(r'^'+settings.APP_PATHNAME+'/index.htm', IndexView.as_view(), name='home'),
    path('', include('arches.urls')),
    re_path(r'^'+settings.APP_PATHNAME+'/user$', UserManagerView.as_view(), name="user_profile_manager"),
    re_path(r'^filetemplate', FileTemplateView.as_view(), name='filetemplate'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/active-consultations', PluginView.as_view(), name='active-consultations'),
    re_path(r'^activeconsultations', ActiveConsultationsView.as_view(), name='activeconsultations'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/consultation-workflow', PluginView.as_view(), name='consultation-workflow'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/application-area', PluginView.as_view(), name='application-area'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/site-visit', PluginView.as_view(), name='site-visit'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/correspondence-workflow', PluginView.as_view(), name='correspondence-workflow'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/communication-workflow', PluginView.as_view(), name='communication-workflow'),
    re_path(r'^'+settings.APP_PATHNAME+'/plugins/init-workflow', PluginView.as_view(), name='init-workflow'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.SHOW_LANGUAGE_SWITCH is True:
#     urlpatterns = i18n_patterns(*urlpatterns)