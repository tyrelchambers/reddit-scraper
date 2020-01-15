import React, { useState, useEffect, useRef } from 'react'
import './SiteIndex.scss'
import Dashboard from '../../../Pages/Dashboard/Dashboard'
import SiteBuilderForm from '../../../components/Forms/SiteBuilderForm'
import { Redirect } from 'react-router-dom'
import SiteBuilderThemeForm from '../../../components/Forms/SiteBuilderThemeForm'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import SiteSaveStatus from '../../../layouts/SiteSaveStatus/SiteSaveStatus'
import ToggleStatus from '../../../components/ToggleStatus/ToggleStatus'
import { addDomainAlias, activateWebsite, updateWebsite } from '../../../api/post'
import { toast } from 'react-toastify'
import { getWebsiteWithToken } from '../../../api/get'
import { deleteImageFromStorage, deleteSite } from '../../../api/delete'
import { deleteDomainAlias } from '../../../api/put'
import Forms from '../Forms/Forms'
import Youtube from '../Timelines/Youtube/Youtube'
import Twitter from '../Timelines/Twitter/Twitter'
import HR from '../../../components/HR/HR'
import { MainButton } from '../../../components/Buttons/Buttons'
import Misc from '../Misc/Misc'
import tabs from '../tabs';
import Tabs from '../../../layouts/Tabs/Tabs'

const SiteIndex = inject("SiteStore", "UserStore")(observer(({SiteStore, UserStore}) => {
  const pondRef = useRef()
  const [config, setConfig] = useState({
    _id: "",
    subdomain: "",
    title: "",
    twitter: "",
    facebook: "",
    instagram: "",
    patreon: "",
    youtube: "",
    podcast: "",
    introduction: "",
    bannerURL: "",
    submissionForm: false,
    youtubeId: "",
    youtubeTimeline: false,
    twitterId: "",
    twitterTimeline: false,
    showCreditLink: true,
    accent: "#000000",
    theme: "light"
  });
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ saving, setSaving ] = useState(false);
  useEffect(() => {
    const yt = UserStore.currentUser.youtubeId;

    const fn = async () => {
      await getWebsiteWithToken().then(res => {
        if (res) {
          setActivated(true)
          setConfig({...config, ...res, youtubeId: yt})
          SiteStore.setPreview({...res})
        }
        setLoading(false);
      });
    }
    fn();
    
  }, []);

  const configHandler = (e) => {
    setConfig({...config, [e.target.name]: e.target.value});
  }
  const params = new URLSearchParams(window.location.search);

  if ( !params.get('t') ) {
    return <Redirect to="/dashboard/site?t=general" />
  }

  const activateSiteHandler = async () => {
    await activateWebsite().then(res => setConfig({...config, ...res}));
    toast.success("Site activated")
    setActivated(true)
  }

  const submitHandler = async () => {
    setSaving(true)
    const data = {...config} 

    data.subdomain = data.subdomain.trim().replace(/\W/g, "-");
    
    if ( !data.subdomain ) {
      return toast.error("Subdomain can't be empty");
    }

    if ( data.introduction > 1000 ) {
      return toast.error("Introduction is too long")
    }

    let bannerURL = data.bannerURL || "";

    if ( pondRef.current && pondRef.current.getFiles().length > 0 ) {
      bannerURL = await processFiles()
    }

    if (!bannerURL) {
      bannerURL = "https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2090&q=80"
    }
    const payload = {
      ...data,
      bannerURL
    }

    if ( data.subdomain !== SiteStore.preview.subdomain ) {
      await deleteDomainAlias(SiteStore.preview.subdomain)
      await addDomainAlias(data.subdomain);
    }

    SiteStore.setPreview(payload)
    await updateWebsite(payload).then(res => toast.success("Changes saved")).catch(console.log);
    setSaving(false)
  }

  const processFiles = async () => {
    const banner = await pondRef.current.processFiles().then(files => {
      return files[0].serverId;
    });
    return banner;
  }

  const deleteImageHandler = async (e) => {
    e.preventDefault();
    const payload = {
      ...config,
      bannerURL: ""
    }

    if ( !config.bannerURL.match(/unsplash/gi) ) {
      await deleteImageFromStorage(config.bannerURL).then(console.log);
    } else {
      setConfig({...config, bannerURL: ""})
    }
    await updateWebsite(payload).then(res => toast.success("Changes saved")).catch(console.log);
  }

  const deleteSiteHandler = async (siteId) => {
    const toDelete = window.confirm("Are you sure you want to delete?");
    
    if (toDelete) {
      await deleteDomainAlias(config.subdomain)
      deleteSite(siteId).then(res => toast.success("Site deleted"))
      window.location.reload();
    }
  }

  if (loading) return null;



  if ( window.innerWidth >= 1024 ) {
    return (
      <Dashboard>
        <div className="pb-">
          <div className="d-f ai-c mb+">
            <h1 className="mr+">Site Builder</h1>
            <a href={`https://${config.subdomain}.reddex.app`} target="_blank" className="td-n link"><i className="fas fa-external-link-square-alt mr---"></i> View your site (refresh to see changes)</a>
          </div>
  
          {!activated &&
            <div className="mt- d-f ai-c">
              <p className="mr-">Activate website</p>
              <ToggleStatus
                context="activate-site"
                option="Activate"
                setToggledHandler={activateSiteHandler}
                toggled={activated ? true : false}
              />
            </div>
          }
          {activated &&
            <>
              <div className="d-f">
                <Tabs url="/dashboard/site" data={tabs}/>

              </div>
              <SiteSaveStatus
                config={config}
                store={SiteStore}
                submitHandler={submitHandler}
                saving={saving}
              />
              <section  className="mt+">
                {params.get('t') === "general" &&
                  <div style={{maxWidth: '600px'}}>
                    <h2>General Settings</h2>
                    <SiteBuilderForm 
                      configHandler={configHandler}
                      config={config}
                      pondRef={pondRef}
                      deleteImageHandler={deleteImageHandler}
                    />
  
                    <div className="mt- mb-">
                      <HR/>
                    </div>
  
                    <h2>Danger Zone</h2>
                    <p className="mb+ mt---">This is permanent. If you delete your site, you can create it again, but everything will be lost.</p>
                    <MainButton
                      value="Delete Site"
                      className="btn btn-tiertiary danger"
                      onClick={() => deleteSiteHandler(config._id)}
                    >
                      <i className="fas fa-trash"></i>
                      
                    </MainButton>
                  </div>
                }
        
                {params.get("t") === "theme" &&
                  <>
                    <div style={{maxWidth: '600px'}}>
                      <h2>Colour Theme</h2>
                      <SiteBuilderThemeForm 
                        configHandler={configHandler}
                        config={config}
                      />
                    </div>
        
                  </>
                }
  
                {params.get('t') === "forms" &&
                  <>
                    <Forms 
                      config={config}
                      setConfig={setConfig}
                    />
                  </>
                }
  
                {params.get('t') === "timelines" &&
                  <>
                    <Youtube
                      config={config}
                      setConfig={setConfig}
                      store={UserStore}
                    />
                    <Twitter
                      config={config}
                      setConfig={setConfig}
                    />
                  </>
                }

                {params.get('t') === "misc" &&
                  <>
                    <Misc
                      config={config}
                      setConfig={setConfig}
                    />
                  </>
                }
              </section>
            </>
          }
        </div>
      </Dashboard>
    ) 
  } else {
    return (
      <Dashboard>
        <h1>Screen size too small</h1>
        <p>Please use your desktop to edit your site.</p>
      </Dashboard>
    )
  }
}));

export default SiteIndex;