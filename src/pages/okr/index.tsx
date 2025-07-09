/* eslint-disable react-hooks/exhaustive-deps */
import HeaderLayout from '@/components/HeaderLayout';
import OKRGrid from '../../components/OKRGrid';
import { useEffect, useState } from 'react';
import SelectYearButton from '@/components/SelectYearButton';
import { RootState, wrapper } from '@/store';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../login';
import { GetServerSidePropsResult } from 'next';
import { useSelector } from 'react-redux';
import { UserState } from '@/store/userSlice';

type OKRPageProps = {
  initialYear?: number;
  availableYears?: number[];
  error?: string;
};

export interface OkrProject {
  project: {
    id: number;
    company_id: number;
    project_name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  objectivesProgress: number;
  keyResultsProgress: number;
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async (
      context
    ): Promise<
      GetServerSidePropsResult<{
        initialYear?: number;
        availableYears?: number[];
        error?: string;
      }>
    > => {
      let userJwt: DecodedToken | null = null;

      if (context.req.cookies.userJWT) {
        const parsedCookies: DecodedToken = jwtDecode(context.req.cookies.userJWT);
        userJwt = parsedCookies;
      }

      try {
        const protocol = context.req.headers['x-forwarded-proto'] || 'http';
        const host = context.req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        const response = await fetch(
          `${baseUrl}/api/okr/years?companyId=${userJwt?.user.companyId}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const availableYears = Array.isArray(data) ? data : [];
        const initialYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();

        return {
          props: {
            initialYear,
            availableYears,
          },
        };
      } catch (error: unknown) {
        console.error('Erro na requisição:', error);
        return {
          props: {
            error: error instanceof Error ? error.message : 'Ocorreu um erro na requisição.',
          },
        };
      }
    }
);

export async function fetchOkrs(
  user: UserState,
  setOkrs: React.Dispatch<React.SetStateAction<OkrProject[]>>
) {
  try {
    if (user?.companyId != null) {
      const response = await fetch(`/api/okr/${user.companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar OKRs: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response from /api/okr:', data); // Corrigido: aguarda o JSON antes do log
      setOkrs(data);
    }
  } catch (error) {
    console.error('Erro ao buscar OKRs:', error);
  }
}

export default function OKRPage({
  initialYear,
  availableYears,
  error,
}: Readonly<OKRPageProps>) {
  const user = useSelector((state: RootState) => state.user);

  const [selectedYear, setSelectedYear] = useState<number>(
    initialYear ?? new Date().getFullYear()
  );
  const [years] = useState<number[]>(availableYears ?? []);
  const [okrs, setOkrs] = useState<OkrProject[]>([]);

  useEffect(() => {
    if (user?.companyId) {
      fetchOkrs(user, setOkrs);
    }
  }, [user?.companyId, years]);

  if (error) {
    return (
      <HeaderLayout>
        <div className="container mx-auto pt-[60px] mt-10 mb-10">
          <p className="text-red-500 font-semibold">
            Ocorreu um erro ao carregar a página: {error}
          </p>
        </div>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout>
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
        <header className="mb-4">
          <SelectYearButton
            years={years}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </header>
        <OKRGrid okrs={okrs} setOkrs={setOkrs} />
      </div>
    </HeaderLayout>
  );
}
