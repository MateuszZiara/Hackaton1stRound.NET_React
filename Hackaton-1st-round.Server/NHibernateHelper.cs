using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Tool.hbm2ddl;

namespace Hackaton_1st_round.Server;

public class NHibernateHelper
{
    private static ISessionFactory _sessionFactory;

    public static NHibernate.ISession OpenSession()
    {
        return SessionFactory.OpenSession();
    }

    private static ISessionFactory SessionFactory
    {
        get
        {
            if (_sessionFactory == null)
            {
                _sessionFactory = Fluently.Configure()
                    .Database(
                        MsSqlConfiguration.MsSql2012.ConnectionString(
                            "Server=localhost\\SQLEXPRESS;Database=Hackaton;Integrated Security=SSPI;Application Name=Hackaton;TrustServerCertificate=true;")
                    ) //TODO NAZWA DLA BAZY DANYCH NA TEN MOMENT TO Hackaton 
                    /* .Mappings(m =>
                         m.FluentMappings.AddFromAssemblyOf<KlientEntity>()
                     ) Przykład mapowania TODO NIE ZAPOMINAĆ O MAPOWANIACH KOLEDZY*/
                    .Mappings(m =>
                         m.FluentMappings.AddFromAssemblyOf<Models.TeamEntity.TeamEntity>())
                    .ExposeConfiguration(cfg => new SchemaUpdate(cfg).Execute(false, true))
                    .BuildSessionFactory();


            }

            return _sessionFactory;
        }
    }
}
