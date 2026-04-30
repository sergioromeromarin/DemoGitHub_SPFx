import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'FacultyTasksWebPartStrings';
import FacultyTasks from './components/FacultyTasks';
import { useAppStore } from 'store/useAppStore';
import * as microsoftTeams from "@microsoft/teams-js";

export default class FacultyTasksWebPart extends BaseClientSideWebPart<{}> {

  public render(): void {
    const element: React.ReactElement<{}> = React.createElement(
      FacultyTasks
    );
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {

    const { setServiceScope, setUserId, setCurrentUICultureName, setAbsoluteUrl, setMsGraphClientFactory, setSpHttpClient, setHasTeamsContext } = useAppStore.getState();
    setServiceScope(this.context.serviceScope);
    setUserId(this.context.pageContext.legacyPageContext.aadUserId.toUpperCase() || '');
    setCurrentUICultureName(this.context.pageContext.cultureInfo.currentUICultureName);
    setAbsoluteUrl(this.context.pageContext.web.absoluteUrl);
    setMsGraphClientFactory(this.context.msGraphClientFactory);
    setSpHttpClient(this.context.spHttpClient);
    setHasTeamsContext(!!this.context.sdks.microsoftTeams);

    // Inicializar Teams SDK si está en Teams
    if (this.context.sdks.microsoftTeams) {
      await microsoftTeams.app.initialize();
    }

    return super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyBackground', semanticColors.bodyBackground || null);
      this.domElement.style.setProperty('--bodyDivider', semanticColors.bodyDivider || null);
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
              ]
            }
          ]
        }
      ]
    };
  }
}
